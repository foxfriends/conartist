use diesel::dsl;
use diesel::prelude::*;
use bcrypt;

use super::Database;
use super::models::*;
use super::schema::*;
use super::views::*;
use crate::error::StringError;

// TODO: do some caching here for efficiency
// TODO: handle errors more properly, returning Result<_, Error> instead of String
//       also update the dbtry! macro to resolve that problem correctly
impl Database {
    pub fn get_user_by_id(&self, maybe_user_id: Option<i32>) -> Result<User, String> {
        let user_id = self.resolve_user_id(maybe_user_id);
        let conn = self.pool.get().unwrap();
        let raw_user =
            users::table
                .filter(users::user_id.eq(user_id))
                .first::<RawUser>(&*conn)
                .map_err(|reason| format!("User with id {} could not be retrieved. Reason: {}", user_id, reason))?;
        let user =
            if raw_user.email.is_some() {
                raw_user.unwrap()
            } else {
                let EmailVerification { email, .. } = emailverifications::table
                    .filter(emailverifications::user_id.eq(user_id))
                    .order_by(emailverifications::expires.desc())
                    .first::<EmailVerification>(&*conn)
                    .map_err(|reason| format!("User with id {} could not be retrieved. Reason: {}", user_id, reason))?;
                let EmailVerification { user_id, .. } = emailverifications::table
                    .filter(emailverifications::email.eq(&email))
                    .order_by(emailverifications::expires.desc())
                    .first::<EmailVerification>(&*conn)
                    .map_err(|reason| format!("User with id {} could not be retrieved. Reason: {}", user_id, reason))?;
                if user_id != raw_user.user_id {
                    return Err("This account's email has been claimed by another user".to_owned())
                }
                raw_user.with_email(email)
            };
        let con_count =
            user_conventions::table
                .filter(user_conventions::user_id.eq(user.user_id))
                .count()
                .get_result::<i64>(&*conn)
                .unwrap_or(0i64);
        Ok(
            User {
                keys: user.keys - con_count as i32,
                ..user
            }
        )
    }

    pub fn get_user_for_email(&self, email: &str) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        let user = {
            let verified = users::table
                .filter(users::email.eq(email))
                .get_result::<RawUser>(&*conn)
                .map(RawUser::unwrap)
                .optional()
                .map_err(|reason| format!("User with email {} could not be retrieved. Reason: {}", email, reason))?;
            if let Some(verified) = verified {
                verified
            } else {
                let EmailVerification { email: retrieved, user_id, .. } = emailverifications::table
                    .filter(emailverifications::email.eq(email))
                    .order_by(emailverifications::expires.desc())
                    .first::<EmailVerification>(&*conn)
                    .map_err(|reason| format!("EmailVerification for user with email {} could not be retrieved. Reason: {}", email, reason))?;
                users::table
                    .filter(users::user_id.eq(user_id))
                    .first::<RawUser>(&*conn)
                    .map(|user| user.with_email(retrieved))
                    .map_err(|reason| format!("User with email {} could not be retrieved. Reason: {}", email, reason))?
            }
        };
        let con_count =
            user_conventions::table
                .filter(user_conventions::user_id.eq(user.user_id))
                .count()
                .get_result::<i64>(&*conn)
                .unwrap_or(0i64);
        Ok(User {
            keys: user.keys - con_count as i32,
            ..user
        })
    }

    pub fn valid_account_exist_for_email(&self, email: &str) -> Result<bool, String> {
        let conn = self.pool.get().unwrap();
        diesel::select(dsl::exists(emailsinuse::table.filter(emailsinuse::email.eq(email))))
            .get_result::<bool>(&*conn)
            .map_err(|reason| format!("Could not check if email {} is in use. Reason: {}", email, reason))
    }

    pub fn is_email_verified(&self, user_id: i32) -> Result<bool, String> {
        let conn = self.pool.get().unwrap();
        // not verified if there's an existing verification
        let pending_verification = diesel
            ::select(dsl::exists(
                emailverifications::table
                    .filter(emailverifications::user_id.eq(user_id))
                    .filter(emailverifications::expires.gt(dsl::now))
            ))
            .get_result::<bool>(&*conn)
            .map_err(|reason| format!("Cannot check email verifications for user with id {}. Reason: {}", user_id, reason))?;
        if pending_verification {
            return Ok(false);
        }
        // also not verified if there's no email
        let RawUser { email, .. } = users::table
            .filter(users::user_id.eq(user_id))
            .get_result::<RawUser>(&*conn)
            .map_err(|reason| format!("Cannot check email for user with id {}. Reason: {}", user_id, reason))?;
        Ok(email.is_some())
    }

    pub fn get_email_verification(&self, user_id: i32) -> Result<EmailVerification, String> {
        let conn = self.pool.get().unwrap();
        emailverifications::table
            .filter(emailverifications::user_id.eq(user_id))
            .order_by(emailverifications::expires.desc())
            .first::<EmailVerification>(&*conn)
            .map_err(|reason| format!("Cannot find email verification for user with id {}. Reason: {}", user_id, reason))
    }

    pub fn create_user(&self, email: String, name: String, password: String) -> Result<(User, EmailVerification), String> {
        let conn = self.pool.get().unwrap();
        let verification_code = crate::rand::nonce().map_err(|_| String::from("A nonce could not be generated"))?;
        conn.transaction(|| {
                let email = email.clone();
                let email_in_use = diesel::select(dsl::exists(emailsinuse::table.filter(emailsinuse::email.eq(&email))))
                    .get_result::<bool>(&*conn)?;
                if email_in_use {
                    return Err(diesel::result::Error::DeserializationError(Box::new(StringError(
                        "The email is already in use by another user".to_owned()
                    ))))
                }
                let user = diesel::insert_into(users::table)
                    .values((users::name.eq(name), users::password.eq(password)))
                    .get_result::<RawUser>(&*conn)?;
                diesel::insert_into(emailverifications::table)
                    .values((
                        emailverifications::verification_code.eq(verification_code),
                        emailverifications::user_id.eq(user.user_id),
                        emailverifications::email.eq(&email),
                    ))
                    .get_result::<EmailVerification>(&*conn)
                    .map(move |email_verification| (user.with_email(email), email_verification))
            })
            .map_err(|reason| format!("Could not create new user for {}. Reason: {}", email, reason))
    }

    pub fn verify_email(&self, verification_code: &str) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let verification = emailverifications::table
                    .filter(emailverifications::verification_code.eq(verification_code))
                    .get_result::<EmailVerification>(&*conn)?;

                // remove all verifications for this user
                dsl::delete(emailverifications::table)
                    .filter(emailverifications::user_id.eq(verification.user_id))
                    .execute(&*conn)?;

                // also all verifications for this email, in case of weird stuff going on
                dsl::delete(emailverifications::table)
                    .filter(emailverifications::email.eq(&verification.email))
                    .execute(&*conn)?;

                dsl::update(users::table)
                    .filter(users::user_id.eq(verification.user_id))
                    .set(users::email.eq(verification.email))
                    .get_result::<RawUser>(&*conn)
                    .map(RawUser::unwrap)
            })
            .map_err(|reason| format!("Could not verify email with code {}. Reason: {}", verification_code, reason))
    }

    pub fn change_email(&self, maybe_user_id: Option<i32>, email: String) -> Result<EmailVerification, String> {
        let user_id = self.resolve_user_id(maybe_user_id);
        let conn = self.pool.get().unwrap();
        let verification_code = crate::rand::nonce().map_err(|_| String::from("A nonce could not be generated"))?;
        conn.transaction(|| {
                let email_in_use = diesel::select(dsl::exists(emailsinuse::table.filter(emailsinuse::email.eq(&email))))
                    .get_result::<bool>(&*conn)?;
                if email_in_use {
                    return Err(diesel::result::Error::DeserializationError(Box::new(StringError(
                        "The email is already in use by another user".to_owned()
                    ))))
                }
                diesel::insert_into(emailverifications::table)
                    .values((
                        emailverifications::verification_code.eq(verification_code),
                        emailverifications::user_id.eq(user_id),
                        emailverifications::email.eq(&email),
                    ))
                    .get_result::<EmailVerification>(&*conn)
            })
            .map_err(|reason| format!("Could not change email of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn set_user_name(&self, maybe_user_id: Option<i32>, name: String) -> Result<User, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::update(users::table)
            .set(users::name.eq(name))
            .filter(users::user_id.eq(user_id))
            .get_result::<RawUser>(&*conn)
            .map(RawUser::unwrap)
            .map_err(|reason| format!("Could not update name of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn set_user_password(&self, maybe_user_id: Option<i32>, orig_password: String, new_password: String) -> Result<User, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let original = users::table
                    .select(users::password)
                    .filter(users::user_id.eq(user_id))
                    .first::<String>(&*conn)?;

                if !bcrypt::verify(&orig_password, &original).unwrap_or(false) {
                    return Err(diesel::result::Error::DeserializationError(Box::new(StringError(
                        "Original password is incorrect".to_owned()
                    ))))
                }

                let hashed = bcrypt::hash(&new_password, bcrypt::DEFAULT_COST)
                    .map_err(|reason| diesel::result::Error::DeserializationError(Box::new(StringError(
                        format!("Couldn't hash password..? Reason: {}", reason)
                    ))))?;

                diesel::update(users::table)
                    .set(users::password.eq(hashed))
                    .filter(users::user_id.eq(user_id))
                    .get_result::<RawUser>(&*conn)
                    .map(RawUser::unwrap)
            })
            .map_err(|reason| format!("Could not update password of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn force_set_password(&self, verification_code: &str, password: &str) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let PasswordReset { user_id, .. } = diesel::update(passwordresets::table)
                    .filter(passwordresets::verification_code.eq(verification_code))
                    .filter(passwordresets::used.eq(false))
                    .set(passwordresets::used.eq(true))
                    .get_result::<PasswordReset>(&*conn)?;

                let hashed = bcrypt::hash(password, bcrypt::DEFAULT_COST)
                    .map_err(|reason| diesel::result::Error::DeserializationError(Box::new(StringError(
                        format!("Couldn't hash password..? Reason: {}", reason)
                    ))))?;

                diesel::update(users::table)
                    .filter(users::user_id.eq(user_id))
                    .set(users::password.eq(hashed))
                    .get_result::<RawUser>(&*conn)
                    .map(RawUser::unwrap)
            })
            .map_err(|reason| format!("Could not update password using code {}. Reason: {}", verification_code, reason))
    }

    pub fn reset_password(&self, email: &str) -> Result<PasswordReset, String> {
        let conn = self.pool.get().unwrap();
        let verification_code = crate::rand::nonce().map_err(|_| String::from("A nonce could not be generated"))?;
        conn.transaction(|| {
                let User { user_id, .. } = users::table
                    .filter(users::email.eq(email))
                    .first::<RawUser>(&*conn)
                    .map(RawUser::unwrap)?;
                diesel::insert_into(passwordresets::table)
                    .values((passwordresets::verification_code.eq(verification_code), passwordresets::user_id.eq(user_id)))
                    .get_result::<PasswordReset>(&*conn)
            })
            .map_err(|reason| format!("Could not reset password of user with email {}. Reason: {}", email, reason))
    }
}
