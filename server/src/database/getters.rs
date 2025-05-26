use chrono::NaiveDate;
use diesel::prelude::*;
use diesel::{dsl, sql_types};
use std::collections::{HashMap, HashSet};

use super::Database;
use super::dsl::*;
use super::models::*;
use super::schema::*;
use super::views::*;

// TODO: do some caching here for efficiency
// TODO: handle errors more properly, returning Result<_, Error> instead of String
//       also update the dbtry! macro to resolve that problem correctly
impl Database {
    pub fn get_settings_for_user(&self, maybe_user_id: Option<i32>) -> Result<Settings, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        usersettings::table
            .filter(usersettings::user_id.eq(user_id))
            .first::<Settings>(&mut conn)
            .map(|settings| Settings {
                currency: settings.currency,
                language: settings.language.trim().to_owned(),
                ..settings
            })
            .map_err(|reason| {
                format!(
                    "Settings for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn get_admin_clearance(&self, maybe_user_id: Option<i32>) -> Result<i32, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        admins::table
            .select(admins::clearance)
            .filter(admins::user_id.eq(user_id))
            .first::<i32>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Admin clearance for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn get_prices_for_user(&self, maybe_user_id: Option<i32>) -> Result<Vec<Price>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        prices::table
            .inner_join(
                currentprices::table.on(prices::type_id
                    .eq(currentprices::type_id)
                    .and(prices::product_id.is_not_distinct_from(currentprices::product_id))
                    .and(prices::quantity.eq(currentprices::quantity))
                    .and(prices::mod_date.eq(currentprices::mod_date))),
            )
            .select(prices::all_columns)
            .filter(prices::user_id.eq(user_id))
            .filter(prices::price.is_not_null())
            .load::<Price>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Prices for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
            .map(|prices| {
                prices
                    .into_iter()
                    .filter(|price| price.price.is_some())
                    .collect()
            })
    }

    pub fn get_conventions_for_user(
        &self,
        maybe_user_id: Option<i32>,
    ) -> Result<Vec<Convention>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        user_conventions::table
            .inner_join(conventions::table)
            .select((
                conventions::con_id,
                user_conventions::user_id.nullable(),
                conventions::title,
                conventions::start_date,
                conventions::end_date,
                conventions::predecessor,
            ))
            .filter(user_conventions::user_id.eq(user_id))
            .order(conventions::start_date.desc())
            .load::<Convention>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Conventions for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn get_products_for_user_con(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Vec<ProductSnapshot>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();

        let end_date = conventions::table
            .select(conventions::end_date)
            .filter(conventions::con_id.eq(con_id))
            .first::<NaiveDate>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Convention with id {} could not be retrieved. Reason: {}",
                    con_id, reason
                )
            })?;

        let date = end_date.and_hms_opt(23, 59, 59).unwrap();

        // TODO: was nice when the counting could be done in SQL... maybe someday it can be improved
        let items_sold: HashMap<i32, i64> = records::table
            .select(unnest(records::products))
            .filter(records::user_id.eq(user_id))
            .filter(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").lt(date))
            .filter(records::con_id.ne(con_id))
            .load::<i32>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Records for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })?
            .into_iter()
            .fold(HashMap::new(), |mut map, index| {
                let amt = map.get(&index).unwrap_or(&0i64) + 1;
                map.insert(index, amt);
                map
            });

        let products = products::table
            .select((
                products::product_id,
                products::type_id,
                products::user_id,
                products::name,
                products::sort,
                products::deleted,
                products::sku,
            ))
            .filter(products::user_id.eq(user_id))
            .group_by(products::product_id)
            .order((products::sort.asc(), products::product_id.asc()))
            .load::<Product>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Products for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })?;

        let product_ids = products
            .iter()
            .map(|product| product.product_id)
            .collect::<Vec<_>>();

        let disabled_ids: HashSet<i32> = productevents::table
            .distinct_on(productevents::product_id)
            .select((productevents::product_id, productevents::event_type))
            .filter(
                productevents::event_type
                    .eq(EventType::Enabled)
                    .or(productevents::event_type.eq(EventType::Disabled)),
            )
            .filter(productevents::product_id.eq_any(&product_ids))
            .filter(productevents::event_time.lt(date))
            .order_by((productevents::product_id, productevents::event_time.desc()))
            .load::<(i32, EventType)>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Events for products with user id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })?
            .into_iter()
            .filter(|(_, event_type)| *event_type == EventType::Disabled)
            .map(|(id, _)| id)
            .collect();

        let inventory: HashMap<i32, i64> = inventory::table
            .select((
                inventory::product_id,
                dsl::sql::<sql_types::BigInt>("sum(quantity)"),
            ))
            .filter(inventory::product_id.eq_any(&product_ids))
            .filter(inventory::mod_date.lt(date))
            .group_by(inventory::product_id)
            .load::<(i32, i64)>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Inventory for products with user id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })?
            .into_iter()
            .collect();

        Ok(products
            .into_iter()
            .map(|product| {
                let sold_amount = *items_sold.get(&product.product_id).unwrap_or(&0i64);
                let quantity = inventory.get(&product.product_id).unwrap_or(&0) - sold_amount;
                let discontinued = disabled_ids.contains(&product.product_id);
                product.with_snapshot_data(i64::max(0, quantity), discontinued)
            })
            .collect())
    }

    pub fn get_prices_for_user_con(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Vec<Price>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();

        let end_date = conventions::table
            .select(conventions::end_date)
            .filter(conventions::con_id.eq(con_id))
            .first::<NaiveDate>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Convention with id {} could not be retrieved. Reason: {}",
                    con_id, reason
                )
            })?;

        let date = end_date.and_hms_opt(23, 59, 59).unwrap();
        prices::table
            .inner_join(
                currentprices::table.on(prices::type_id
                    .eq(currentprices::type_id)
                    .and(prices::product_id.is_not_distinct_from(currentprices::product_id))
                    .and(prices::quantity.eq(currentprices::quantity))
                    .and(prices::mod_date.eq(currentprices::mod_date))),
            )
            .select(prices::all_columns)
            .filter(prices::user_id.eq(user_id))
            .filter(prices::price.is_not_null())
            // TODO: there's a bug here with time zones: prices modified before the end of day but
            // after the end of day in UTC will not be reported
            //
            // Solution: Store a time zone offset with each convention...
            //  This solution should also make a lot of other time related improvements possible!
            .filter(prices::mod_date.lt(date))
            .load::<Price>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Prices for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
            .map(|prices| {
                prices
                    .into_iter()
                    .filter(|price| price.price.is_some())
                    .collect()
            })
    }
}
