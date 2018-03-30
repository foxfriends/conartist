use std::collections::HashMap;
use diesel::{dsl, sql_types};
use diesel::prelude::*;
use chrono::NaiveDate;

use super::Database;
use super::models::*;
use super::schema::*;
use super::dsl::*;

// TODO: do some caching here for efficiency
// TODO: handle errors more properly, returning Result<_, Error> instead of String
//       also update the dbtry! macro to resolve that problem correctly
impl Database {
    pub fn get_user_for_email(&self, email: &str) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        let user = 
            users::table
                .filter(users::email.eq(email))
                .first::<User>(&*conn)
                .map_err(|reason| format!("User with email {} could not be retrieved. Reason: {}", email, reason))?;
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

    pub fn get_user_by_id(&self, maybe_user_id: Option<i32>) -> Result<User, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        let user = 
            users::table
                .filter(users::user_id.eq(user_id))
                .first::<User>(&*conn)
                .map_err(|reason| format!("User with id {} could not be retrieved. Reason: {}", user_id, reason))?;
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

    pub fn get_settings_for_user(&self, maybe_user_id: Option<i32>) -> Result<Settings, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        usersettings::table
            .filter(usersettings::user_id.eq(user_id))
            .first::<Settings>(&*conn)
            .map_err(|reason| format!("Settings for user with id {} could not be retrieved. Reason: {}", user_id, reason))
    }

    pub fn get_product_types_for_user(&self, maybe_user_id: Option<i32>) -> Result<Vec<ProductType>, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        producttypes::table
            .filter(producttypes::user_id.eq(user_id))
            .load::<ProductType>(&*conn)
            .map_err(|reason| format!("ProductTypes for user with id {} could not be retrieved. Reason: {}", user_id, reason))
    }

    pub fn get_products_for_user(&self, maybe_user_id: Option<i32>) -> Result<Vec<ProductWithQuantity>, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        // TODO: was nice when the counting could be done in SQL... maybe someday it can be improved
        let items_sold: HashMap<i32, i64> =
            records::table
                .select(unnest(records::products))
                .filter(records::user_id.eq(user_id))
                .load::<i32>(&*conn)
                .map_err(|reason| format!("Records for user with id {} could not be retrieved. Reason: {}", user_id, reason))?
                .into_iter()
                .fold(HashMap::new(), |mut map, index| {
                    let amt = map.get(&index).unwrap_or(&0i64) + 1;
                    map.insert(index, amt);
                    map
                });

        let products_with_quantity =
            products::table
                .left_outer_join(inventory::table)
                .select((products::product_id, products::type_id, products::user_id, products::name, products::discontinued, dsl::sql::<sql_types::BigInt>("sum(inventory.quantity)")))
                .filter(products::user_id.eq(user_id))
                .group_by(products::product_id)
                .load::<ProductWithQuantity>(&*conn)
                .map_err(|reason| format!("Products for user with id {} could not be retrieved. Reason: {}", user_id, reason))?;

        Ok(products_with_quantity
            .into_iter()
            .map(|product| {
                 let sold_amount = *items_sold.get(&product.product_id).unwrap_or(&0i64);
                 ProductWithQuantity { quantity: product.quantity - sold_amount, ..product }
            })
            .collect())
    }

    pub fn get_prices_for_user(&self, maybe_user_id: Option<i32>) -> Result<Vec<Price>, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        use database::schema::prices;
        prices::table
            .distinct_on((prices::type_id, prices::product_id, prices::quantity))
            .filter(prices::user_id.eq(user_id))
            .order(prices::mod_date.desc())
            .load::<Price>(&*conn)
            .map_err(|reason| format!("Prices for user with id {} could not be retrieved. Reason: {}", user_id, reason))
            .map(|prices| prices.into_iter().filter(|price| price.price.is_some()).collect())
    }

    pub fn get_conventions_for_user(&self, maybe_user_id: Option<i32>) -> Result<Vec<Convention>, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        user_conventions::table
            .inner_join(conventions::table)
            .select((conventions::con_id, user_conventions::user_id.nullable(), conventions::title, conventions::start_date, conventions::end_date, conventions::predecessor))
            .filter(user_conventions::user_id.eq(user_id))
            .load::<Convention>(&*conn)
            .map_err(|reason| format!("Conventions for user with id {} could not be retrieved. Reason: {}", user_id, reason))
    }

    pub fn get_convention_for_user(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Convention, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        user_conventions::table
            .inner_join(conventions::table)
            .select((conventions::con_id, user_conventions::user_id.nullable(), conventions::title, conventions::start_date, conventions::end_date, conventions::predecessor))
            .filter(user_conventions::user_id.eq(user_id))
            .filter(user_conventions::con_id.eq(con_id))
            .first::<Convention>(&*conn)
            .map_err(|reason| format!("Convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))
    }

    pub fn get_products_for_user_con(&self, user_id: Option<i32>, _con_id: i32) -> Result<Vec<ProductWithQuantity>, String> {
        // TODO: should check for products and quantities before a certain date
        self.get_products_for_user(user_id)
    }

    pub fn get_prices_for_user_con(&self, user_id: Option<i32>, _con_id: i32) -> Result<Vec<Price>, String> {
        // TODO: should check for prices before a certain date
        self.get_prices_for_user(user_id)
    }

    pub fn get_records_for_user_con(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Vec<Record>, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        records::table
            .filter(records::user_id.eq(user_id))
            .filter(records::con_id.eq(con_id))
            .load::<Record>(&*conn)
            .map_err(|reason| format!("Records for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))
    }

    pub fn get_expenses_for_user_con(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Vec<Expense>, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        expenses::table
            .filter(expenses::user_id.eq(user_id))
            .filter(expenses::con_id.eq(con_id))
            .load::<Expense>(&*conn)
            .map_err(|reason| format!("Expenses for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))
    }

    pub fn get_conventions_after(&self, date: NaiveDate, exclude_mine: bool) -> Result<Vec<Convention>, String> {
        let conn = self.pool.get().unwrap();
        if exclude_mine {
            let user_id = self.resolve_user_id(None)?;
            let user_convention = user_conventions::table
                .filter(user_conventions::user_id.eq(user_id))
                .filter(user_conventions::con_id.eq(conventions::con_id));
            conventions::table
                .filter(conventions::start_date.gt(date))
                .filter(dsl::not(dsl::exists(user_convention)))
                .load::<DetachedConvention>(&*conn)
                .map(|cons| cons.into_iter().map(Into::<Convention>::into).collect())
                .map_err(|reason| format!("Conventions after {} could not be retrieved (excluding mine). Reason: {}" , date, reason))
        } else {
            conventions::table
                .filter(conventions::start_date.gt(date))
                .load::<DetachedConvention>(&*conn)
                .map(|cons| cons.into_iter().map(Into::<Convention>::into).collect())
                .map_err(|reason| format!("Conventions after {} could not be retrieved. Reason: {}", date, reason))
        }
    }

    pub fn get_convention_extra_info_for_convention(&self, con_id: i32) -> Result<Vec<ConventionExtraInfo>, String> {
        let conn = self.pool.get().unwrap();
        conventionextrainfo::table
            .filter(conventionextrainfo::con_id.eq(con_id))
            .load::<ConventionExtraInfo>(&*conn)
            .map_err(|reason| format!("Convention extra info for convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }

    pub fn get_convention_user_info_for_convention(&self, con_id: i32) -> Result<Vec<ConventionUserInfo>, String> {
        let conn = self.pool.get().unwrap();
        conventionuserinfo::table
            .left_outer_join(conventioninforatings::table)
            .select((
                conventionuserinfo::con_info_id,
                conventionuserinfo::information, 
                dsl::sql::<sql_types::BigInt>("SUM(CASE rating WHEN true THEN 1 ELSE 0 END)::INT"),
                dsl::sql::<sql_types::BigInt>("SUM(CASE rating WHEN false THEN 1 ELSE 0 END)::INT"),
            ))
            .filter(conventionuserinfo::con_id.eq(con_id))
            .group_by(conventionuserinfo::con_info_id)
            .load::<ConventionUserInfo>(&*conn)
            .map_err(|reason| format!("Convention user info for convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }

    pub fn get_user_vote_for_convention_user_info(&self, maybe_user_id: Option<i32>, con_info_id: i32) -> Result<i32, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conventioninforatings::table
            .select(dsl::sql::<sql_types::Int4>("CASE rating WHEN true THEN 1 WHEN false THEN -1 ELSE 0 END"))
            .filter(conventioninforatings::user_id.eq(user_id))
            .filter(conventioninforatings::con_info_id.eq(con_info_id))
            .first::<i32>(&*conn)
            .or(Ok(0))
    }

    pub fn get_images_for_convention(&self, con_id: i32) -> Result<Vec<ConventionImage>, String> {
        let conn = self.pool.get().unwrap();
        conventionimages::table
            .distinct_on(conventionimages::image_uuid)
            .filter(conventionimages::con_id.eq(con_id))
            .load::<ConventionImage>(&*conn)
            .map_err(|reason| format!("Images for convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }
}
