use diesel::prelude::*;

use super::Database;
use super::models::*;
use super::schema::*;

use crate::money::Currency;

impl Database {
    pub fn add_user_keys(&self, maybe_user_id: Option<i32>, quantity: i32) -> Result<User, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        diesel::update(users::table)
            .set(users::keys.eq(users::keys + quantity))
            .filter(users::user_id.eq(user_id))
            .get_result::<RawUser>(&mut conn)
            .map(RawUser::unwrap)
            .map_err(|reason| {
                format!(
                    "Could not update keys of user with id {}. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn set_user_settings_currency(
        &self,
        maybe_user_id: Option<i32>,
        currency: Currency,
    ) -> Result<Currency, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        diesel::insert_into(usersettings::table)
            .values((
                usersettings::user_id.eq(user_id),
                usersettings::currency.eq(currency.to_string()),
            ))
            .on_conflict(usersettings::user_id)
            .do_update()
            .set(usersettings::currency.eq(currency.to_string()))
            .returning(usersettings::currency)
            .get_result::<Currency>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Could not update currency setting for user with id {}. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn set_user_settings_language(
        &self,
        maybe_user_id: Option<i32>,
        language: String,
    ) -> Result<String, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        diesel::insert_into(usersettings::table)
            .values((
                usersettings::user_id.eq(user_id),
                usersettings::language.eq(&language),
            ))
            .on_conflict(usersettings::user_id)
            .do_update()
            .set(usersettings::language.eq(&language))
            .returning(usersettings::language)
            .get_result::<String>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Could not update language setting for user with id {}. Reason: {}",
                    user_id, reason
                )
            })
    }
}
