use diesel::{self, dsl};
use diesel::prelude::*;
use chrono::{NaiveDate, Utc, DateTime, FixedOffset};
use uuid::Uuid;
use serde_json;

use super::schema::*;
use super::models::*;
use super::Database;
use money::Money;

impl Database {
    pub fn create_user(&self, email: String, name: String, password: String) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        diesel::insert_into(users::table)
            .values((users::email.eq(&email), users::name.eq(name), users::password.eq(password)))
            .get_result::<User>(&*conn)
            .map_err(|reason| format!("Could not create new user for {}. Reason: {}", email, reason))
    }

    pub fn create_product_type(&self, maybe_user_id: Option<i32>, name: String, color: i32, sort: i32) -> Result<ProductType, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::insert_into(producttypes::table)
            .values((producttypes::user_id.eq(user_id), producttypes::name.eq(name), producttypes::color.eq(color), producttypes::sort.eq(sort)))
            .get_result::<ProductType>(&*conn)
            .map_err(|reason| format!("Failed to create new product type for user with id {}. Reason: {}", user_id, reason))
    }

    pub fn create_product(&self, maybe_user_id: Option<i32>, type_id: i32, name: String, quantity: i32, sort: i32) -> Result<ProductWithQuantity, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| -> diesel::result::QueryResult<ProductWithQuantity> {
                let product =
                    diesel::insert_into(products::table)
                        .values((products::user_id.eq(user_id), products::type_id.eq(type_id), products::name.eq(name), products::sort.eq(sort)))
                        .get_result::<Product>(&*conn)?;

                diesel::insert_into(inventory::table)
                    .values((inventory::product_id.eq(product.product_id), inventory::quantity.eq(quantity)))
                    .execute(&*conn)?;

                Ok(product.with_quantity(quantity as i64))
            })
            .map_err(|reason| format!("Failed to create new product for user with id {}. Reason: {}", user_id, reason))
    }

    pub fn create_price(
        &self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        product_id: Option<i32>,
        quantity: i32,
        price: Money,
    ) -> Result<Price, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::insert_into(prices::table)
            .values((prices::user_id.eq(user_id), prices::type_id.eq(type_id), prices::product_id.eq(product_id), prices::quantity.eq(quantity), prices::price.eq(price.to_string())))
            .get_result::<Price>(&*conn)
            .map_err(|reason| format!("Could not create price for user with id {}. Reason: {}", user_id, reason))
    }

    pub fn create_user_convention(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Convention, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let convention =
                    conventions::table
                        .filter(conventions::con_id.eq(con_id))
                        .first::<DetachedConvention>(&*conn)?;

                if convention.end_date.and_hms(23, 59, 59) < Utc::now().naive_utc() {
                    return Err(
                        diesel::result::Error::DeserializationError(
                            Box::new(
                                ::error::StringError(
                                    format!("Convention with id {} is already over", convention.con_id)
                                )
                            )
                        )
                    )
                }

                diesel::insert_into(user_conventions::table)
                    .values((user_conventions::user_id.eq(user_id), user_conventions::con_id.eq(con_id)))
                    .execute(&*conn)?;
                Ok(convention.attached_to(user_id))
            })
            .map_err(|reason| format!("Could not create user_convention for user with id {} and convention with id {}. Reason: {}", user_id, con_id, reason))
    }

    pub fn create_user_record(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
        gen_id: Uuid,
        products: Vec<i32>,
        price: Money,
        time: DateTime<FixedOffset>,
        info: String,
    ) -> Result<Record, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
            diesel::insert_into(records::table)
                .values((
                    records::user_id.eq(user_id),
                    records::con_id.eq(con_id),
                    records::products.eq(products.clone()),
                    records::price.eq(price.to_string()),
                    records::sale_time.eq(time.to_rfc3339()),
                    records::info.eq(info.clone()),
                    records::gen_id.eq(gen_id),
                ))
                .on_conflict((records::user_id, records::sale_time, records::gen_id))
                .do_update()
                .set(&RecordChanges::new(Some(products), Some(price), Some(info)))
                .get_result::<Record>(&*conn)
        })
        .map_err(|reason| format!("Could not create record for user with id {} and convention with id {}. Reason: {}", user_id, con_id, reason))
    }

    pub fn create_user_expense(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
        gen_id: Uuid,
        price: Money,
        category: String,
        description: String,
        time: DateTime<FixedOffset>,
    ) -> Result<Expense, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
            diesel::insert_into(expenses::table)
                .values((
                    expenses::user_id.eq(user_id),
                    expenses::con_id.eq(con_id),
                    expenses::price.eq(price.to_string()),
                    expenses::category.eq(category.clone()),
                    expenses::description.eq(description.clone()),
                    expenses::spend_time.eq(time.to_rfc3339()),
                    expenses::gen_id.eq(gen_id),
                ))
                .on_conflict((expenses::user_id, expenses::spend_time, expenses::gen_id))
                .do_update()
                .set(&ExpenseChanges::new(Some(category), Some(description), Some(price)))
                .get_result::<Expense>(&*conn)
        })
        .map_err(|reason| format!("Could not create expense for user with id {} and convention with id {}. Reason: {}", user_id, con_id, reason))
    }

    pub fn create_convention_user_info(&self, maybe_user_id: Option<i32>, con_id: i32, info: String) -> Result<ConventionUserInfo, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let convention =
                    conventions::table
                        .filter(conventions::con_id.eq(con_id));

                if !diesel::select(dsl::exists(convention)).get_result::<bool>(&*conn)? {
                    return Err(diesel::result::Error::NotFound)
                }

                diesel::insert_into(conventionuserinfo::table)
                    .values((conventionuserinfo::user_id.eq(user_id), conventionuserinfo::con_id.eq(con_id), conventionuserinfo::information.eq(info)))
                    .get_result::<RawConventionUserInfo>(&*conn)
                    .map(Into::into)
            })
            .map_err(|reason| format!("Could not add convention user info to convention with id {}. Reason: {}", con_id, reason))
    }

    pub fn create_convention(&self, maybe_user_id: Option<i32>, title: String, start_date: NaiveDate, end_date: NaiveDate) -> Result<Convention, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let clearance =
                    admins::table
                        .select(admins::clearance)
                        .filter(admins::user_id.eq(user_id))
                        .first::<i32>(&*conn)
                        .unwrap_or(0);

                if clearance == 0 {
                    return Err(diesel::result::Error::NotFound)
                }

                diesel::insert_into(conventions::table)
                    .values((conventions::title.eq(&title), conventions::start_date.eq(start_date), conventions::end_date.eq(end_date)))
                    .get_result::<DetachedConvention>(&*conn)
                    .map(Into::into)
            })
            .map_err(|reason| format!("Could not create convention named {}. Reason: {}", title, reason))
    }

    pub fn create_convention_extra_info(&self, maybe_user_id: Option<i32>, con_id: i32, title: String, info: Option<serde_json::Value>, action: Option<String>, action_text: Option<String>) -> Result<ConventionExtraInfo, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let clearance =
                    admins::table
                        .select(admins::clearance)
                        .filter(admins::user_id.eq(user_id))
                        .first::<i32>(&*conn)
                        .unwrap_or(0);

                if clearance == 0 {
                    return Err(diesel::result::Error::NotFound)
                }

                diesel::insert_into(conventionextrainfo::table)
                    .values((conventionextrainfo::con_id.eq(con_id), conventionextrainfo::title.eq(&title), conventionextrainfo::info.eq(info), conventionextrainfo::action.eq(action), conventionextrainfo::action_text.eq(action_text)))
                    .get_result::<ConventionExtraInfo>(&*conn)
                    .map(Into::into)
            })
            .map_err(|reason| format!("Could not add info {} to convention with id {}. Reason: {}", title, con_id, reason))
    }
}
