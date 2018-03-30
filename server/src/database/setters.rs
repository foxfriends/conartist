use diesel::prelude::*;
use diesel;
use bcrypt;

use super::schema::*;
use super::models::*;
use super::Database;

use money::Currency;

impl Database {
    pub fn set_user_email(&self, maybe_user_id: Option<i32>, email: String) -> Result<User, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::update(users::table)
            .set(users::email.eq(email))
            .filter(users::user_id.eq(user_id))
            .get_result::<User>(&*conn)
            .map_err(|reason| format!("Could not update email of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn set_user_password(&self, maybe_user_id: Option<i32>, orig_password: String, new_password: String) -> Result<User, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let original = 
                    users::table
                        .select(users::password)
                        .filter(users::user_id.eq(user_id))
                        .first::<String>(&*conn)?;

                if !bcrypt::verify(&orig_password, &original).unwrap_or(false) {
                    return Err(
                        diesel::result::Error::DeserializationError(
                            Box::new(
                                ::error::StringError(
                                    "Original password is incorrect".to_owned()
                                )
                            )
                        )
                    )
                }

                let hashed = bcrypt::hash(&new_password, bcrypt::DEFAULT_COST)
                    .map_err(|reason|
                        diesel::result::Error::DeserializationError(
                            Box::new(
                                ::error::StringError(
                                    format!("Couldn't hash password..? Reason: {}", reason)
                                )
                            )
                        )
                    )?;

                diesel::update(users::table)
                    .set(users::password.eq(hashed))
                    .filter(users::user_id.eq(user_id))
                    .get_result::<User>(&*conn)
            })
            .map_err(|reason| format!("Could not update password of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn set_user_name(&self, maybe_user_id: Option<i32>, name: String) -> Result<User, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::update(users::table)
            .set(users::name.eq(name))
            .filter(users::user_id.eq(user_id))
            .get_result::<User>(&*conn)
            .map_err(|reason| format!("Could not update name of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn add_user_keys(&self, maybe_user_id: Option<i32>, quantity: i32) -> Result<User, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::update(users::table)
            .set(users::keys.eq(users::keys + quantity))
            .filter(users::user_id.eq(user_id))
            .get_result::<User>(&*conn)
            .map_err(|reason| format!("Could not update keys of user with id {}. Reason: {}", user_id, reason))
    }

    pub fn set_user_settings_currency(&self, maybe_user_id: Option<i32>, currency: Currency) -> Result<Currency, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::insert_into(usersettings::table)
            .values((usersettings::user_id.eq(user_id), usersettings::currency.eq(currency.to_string())))
            .on_conflict(usersettings::user_id)
            .do_update()
            .set(usersettings::currency.eq(currency.to_string()))
            .returning(usersettings::currency)
            .get_result::<Currency>(&*conn)
            .map_err(|reason| format!("Could not update currency setting for user with id {}. Reason: {}", user_id, reason))
    }
}
