use chrono::{NaiveDate, Utc};
use diesel::prelude::*;
use diesel::{self, dsl};
use serde_json;

use super::Database;
use super::models::*;
use super::schema::*;
use crate::money::Money;

impl Database {
    pub fn create_price(
        &self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        product_id: Option<i32>,
        quantity: i32,
        price: Money,
    ) -> Result<Price, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        diesel::insert_into(prices::table)
            .values((
                prices::user_id.eq(user_id),
                prices::type_id.eq(type_id),
                prices::product_id.eq(product_id),
                prices::quantity.eq(quantity),
                prices::price.eq(price.to_string()),
            ))
            .get_result::<Price>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Could not create price for user with id {}. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn create_user_convention(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Convention, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
                let convention =
                    conventions::table
                        .filter(conventions::con_id.eq(con_id))
                        .first::<DetachedConvention>(conn)?;

                if convention.end_date.and_hms(23, 59, 59) < Utc::now().naive_utc() {
                    return Err(
                        diesel::result::Error::DeserializationError(
                            Box::new(
                                crate::error::StringError(
                                    format!("Convention with id {} is already over", convention.con_id)
                                )
                            )
                        )
                    )
                }

                diesel::insert_into(user_conventions::table)
                    .values((user_conventions::user_id.eq(user_id), user_conventions::con_id.eq(con_id)))
                    .execute(conn)?;
                Ok(convention.attached_to(user_id))
            })
            .map_err(|reason| format!("Could not create user_convention for user with id {} and convention with id {}. Reason: {}", user_id, con_id, reason))
    }

    pub fn create_convention_user_info(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
        info: String,
    ) -> Result<ConventionUserInfo, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let convention = conventions::table.filter(conventions::con_id.eq(con_id));

            if !diesel::select(dsl::exists(convention)).get_result::<bool>(conn)? {
                return Err(diesel::result::Error::NotFound);
            }

            diesel::insert_into(conventionuserinfo::table)
                .values((
                    conventionuserinfo::user_id.eq(user_id),
                    conventionuserinfo::con_id.eq(con_id),
                    conventionuserinfo::information.eq(info),
                ))
                .get_result::<RawConventionUserInfo>(conn)
                .map(Into::into)
        })
        .map_err(|reason| {
            format!(
                "Could not add convention user info to convention with id {}. Reason: {}",
                con_id, reason
            )
        })
    }

    pub fn create_convention(
        &self,
        maybe_user_id: Option<i32>,
        title: String,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<Convention, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let clearance = admins::table
                .select(admins::clearance)
                .filter(admins::user_id.eq(user_id))
                .first::<i32>(conn)
                .unwrap_or(0);

            if clearance == 0 {
                return Err(diesel::result::Error::NotFound);
            }

            diesel::insert_into(conventions::table)
                .values((
                    conventions::title.eq(&title),
                    conventions::start_date.eq(start_date),
                    conventions::end_date.eq(end_date),
                ))
                .get_result::<DetachedConvention>(conn)
                .map(Into::into)
        })
        .map_err(|reason| {
            format!(
                "Could not create convention named {}. Reason: {}",
                title, reason
            )
        })
    }

    pub fn create_convention_extra_info(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
        title: String,
        info: Option<serde_json::Value>,
        action: Option<String>,
        action_text: Option<String>,
    ) -> Result<ConventionExtraInfo, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let clearance = admins::table
                .select(admins::clearance)
                .filter(admins::user_id.eq(user_id))
                .first::<i32>(conn)
                .unwrap_or(0);

            if clearance == 0 {
                return Err(diesel::result::Error::NotFound);
            }

            diesel::insert_into(conventionextrainfo::table)
                .values((
                    conventionextrainfo::con_id.eq(con_id),
                    conventionextrainfo::title.eq(&title),
                    conventionextrainfo::info.eq(info),
                    conventionextrainfo::action.eq(action),
                    conventionextrainfo::action_text.eq(action_text),
                ))
                .get_result::<ConventionExtraInfo>(conn)
                .map(Into::into)
        })
        .map_err(|reason| {
            format!(
                "Could not add info {} to convention with id {}. Reason: {}",
                title, con_id, reason
            )
        })
    }
}
