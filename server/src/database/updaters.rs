//! Methods for updating the database with
use diesel::{self, dsl, sql_types};
use diesel::prelude::*;
use chrono::Utc;

use super::Database;
use super::models::*;
use super::schema::*;
use super::dsl::*;
use money::Money;

impl Database {
    pub fn update_product_type(&self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        name: Option<String>,
        color: Option<i32>,
        discontinued: Option<bool>,
        sort: Option<i32>,
    ) -> Result<ProductType, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::update(producttypes::table)
            .filter(producttypes::type_id.eq(type_id))
            .filter(producttypes::user_id.eq(user_id))
            .set(&ProductTypeChange { name, color, discontinued, sort })
            .get_result(&*conn)
            .map_err(|reason| format!("Could not update product type with id {}. Reason: {}", type_id, reason))
    }

    pub fn update_product(&self,
        maybe_user_id: Option<i32>,
        product_id: i32,
        name: Option<String>,
        quantity: Option<i32>,
        discontinued: Option<bool>,
        sort: Option<i32>,
    ) -> Result<ProductWithQuantity, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        conn.transaction(|| {
                let product =
                    products::table
                        .filter(products::product_id.eq(product_id))
                        .filter(products::user_id.eq(user_id));
                if !diesel::select(dsl::exists(product)).get_result::<bool>(&*conn)? {
                    return Err(diesel::result::Error::NotFound)
                }

                let sold =
                    records::table
                        .select(unnest(records::products))
                        .filter(records::user_id.eq(user_id))
                        .load::<i32>(&*conn)
                        .unwrap_or(vec![])
                        .into_iter()
                        .filter(|id| *id == product_id)
                        .collect::<Vec<_>>()
                        .len() as i64;

                let updated_product: Product =
                    if name.is_some() || discontinued.is_some() || sort.is_some() {
                        diesel::update(products::table)
                            .filter(products::product_id.eq(product_id))
                            .filter(products::user_id.eq(user_id))
                            .set(&ProductChanges { name, discontinued, sort })
                            .get_result(&*conn)?
                    } else {
                        products::table
                            .filter(products::product_id.eq(product_id))
                            .first(&*conn)?
                    };

                let total =
                    inventory::table
                        .select(dsl::sum(inventory::quantity))
                        .filter(inventory::product_id.eq(product_id))
                        .group_by(inventory::product_id)
                        .first::<_>(&*conn)
                        .unwrap_or(None)
                        .unwrap_or(0i64);

                if let Some(quantity) = quantity {
                    // Allow (total-sold) here to be negative to compensate for overselling miscounted
                    // items
                    let quantity_delta = (quantity as i64) - (total - sold);
                    diesel::insert_into(inventory::table)
                        .values((inventory::product_id.eq(product_id), inventory::quantity.eq(quantity_delta as i32)))
                        .execute(&*conn)?;
                }

                Ok(updated_product.with_quantity(quantity.unwrap_or(i64::max(0, total - sold) as i32) as i64))
            })
            .map_err(|reason| format!("Could not update product with id {}. Reason: {}", product_id, reason))
    }

    pub fn update_record(&self, maybe_user_id: Option<i32>, record_id: i32, products: Option<Vec<i32>>, price: Option<Money>, info: Option<String>) -> Result<Record, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let record = records::table
                    .filter(records::record_id.eq(record_id))
                    .filter(records::user_id.eq(user_id))
                    .first::<Record>(&*conn)?;

                let convention = conventions::table
                    .filter(conventions::con_id.eq(record.con_id))
                    .first::<DetachedConvention>(&*conn)?;

                diesel::update(records::table)
                    .filter(records::record_id.eq(record_id))
                    .set(&RecordChanges::new(products, price, info))
                    .get_result::<Record>(&*conn)
            })
            .map_err(|reason| format!("Could not update record with id {}. Reason: {}", record_id, reason))
    }

    pub fn update_expense(&self, maybe_user_id: Option<i32>, expense_id: i32, category: Option<String>, price: Option<Money>, description: Option<String>) -> Result<Expense, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let expense =
                    expenses::table
                        .filter(expenses::expense_id.eq(expense_id))
                        .filter(expenses::user_id.eq(user_id))
                        .first::<Expense>(&*conn)?;
                let convention =
                    conventions::table
                        .filter(conventions::con_id.eq(expense.con_id))
                        .first::<DetachedConvention>(&*conn)?;

                diesel::update(expenses::table)
                    .filter(expenses::expense_id.eq(expense_id))
                    .set(&ExpenseChanges::new(category, description, price))
                    .get_result::<Expense>(&*conn)
            })
            .map_err(|reason| format!("Could not update expense with id {}. Reason: {}", expense_id, reason))
    }

    pub fn update_convention_user_info_vote(&self, maybe_user_id: Option<i32>, info_id: i32, approved: bool) -> Result<ConventionUserInfo, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        conn.transaction(|| {
                diesel::insert_into(conventioninforatings::table)
                    .values((conventioninforatings::user_id.eq(user_id), conventioninforatings::con_info_id.eq(info_id), conventioninforatings::rating.eq(approved)))
                    .on_conflict((conventioninforatings::con_info_id, conventioninforatings::user_id))
                    .do_update()
                    .set(conventioninforatings::rating.eq(approved))
                    .execute(&*conn)?;

                conventionuserinfo::table
                    .left_outer_join(conventioninforatings::table)
                    .select((
                        conventionuserinfo::con_info_id,
                        conventionuserinfo::information,
                        dsl::sql::<sql_types::Integer>("SUM(CASE rating WHEN true THEN 1 ELSE 0 END)::INT"),
                        dsl::sql::<sql_types::Integer>("SUM(CASE rating WHEN false THEN 1 ELSE 0 END)::INT"),
                    ))
                    .filter(conventionuserinfo::con_info_id.eq(info_id))
                    .group_by(conventionuserinfo::con_info_id)
                    .first::<ConventionUserInfo>(&*conn)
            })
            .map_err(|reason| format!("Could not change vote for user with id {} on info with id {}. Reason: {}", user_id, info_id, reason))
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
}
