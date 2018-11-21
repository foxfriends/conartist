use diesel::dsl;
use diesel::prelude::*;

use super::Database;
use super::models::*;
use super::schema::*;

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
                    .filter(emailverifications::expires.gt(dsl::now))
                    .first::<EmailVerification>(&*conn)
                    .map_err(|reason| format!("User with id {} could not be retrieved. Reason: {}", user_id, reason))?;
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
                    .filter(emailverifications::expires.gt(dsl::now))
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
        Ok(
            User {
                keys: user.keys - con_count as i32,
                ..user
            }
        )
    }

    pub fn create_user(&self, email: String, name: String, password: String) -> Result<(User, EmailVerification), String> {
        let conn = self.pool.get().unwrap();
        let verification_code = crate::rand::nonce().map_err(|_| String::from("A nonce could not be generated"))?;
        conn.transaction(|| {
                let email = email.clone();
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
                    .filter(emailverifications::expires.gt(dsl::now))
                    .get_result::<EmailVerification>(&*conn)?;

                dsl::delete(emailverifications::table)
                    .filter(emailverifications::verification_code.eq(verification_code))
                    .execute(&*conn)?;

                dsl::update(users::table)
                    .filter(users::user_id.eq(verification.user_id))
                    .set(users::email.eq(verification.email))
                    .get_result::<RawUser>(&*conn)
                    .map(RawUser::unwrap)
            })
            .map_err(|reason| format!("Could not verify email with code {}. Reason: {}", verification_code, reason))
    }

    pub fn change_password(&self, user_id: i32, hashed_password: String) -> Result<(), String> {
        let conn = self.pool.get().unwrap();
        diesel::update(users::table)
            .set(users::password.eq(hashed_password))
            .filter(users::user_id.eq(user_id))
            .execute(&*conn)
            .map_err(|reason| format!("Could not change password of user with id {}. Reason: {}", user_id, reason))
            .map(|_| ())
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
