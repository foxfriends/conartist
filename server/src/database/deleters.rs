use diesel::prelude::*;
use diesel;
use chrono::Utc;

use super::schema::*;
use super::models::*;
use super::Database;
use money::Money;

impl Database {
    pub fn delete_price(&self, maybe_user_id: Option<i32>, type_id: i32, product_id: Option<i32>, quantity: i32) -> Result<bool, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::insert_into(prices::table)
            .values((prices::user_id.eq(user_id), prices::type_id.eq(type_id), prices::product_id.eq(product_id), prices::quantity.eq(quantity), prices::price.eq(None::<Money>)))
            .execute(&*conn)
            .map_err(|reason| format!("Could not delete price for user with id {}. Reason: {}", user_id, reason))
            .map(|size| size == 1)
    }

    pub fn delete_record(&self, maybe_user_id: Option<i32>, record_id: i32) -> Result<bool, String> {
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

                diesel::delete(records::table)
                    .filter(records::record_id.eq(record_id))
                    .execute(&*conn)
                    .map(|size| size == 1)
            })
            .map_err(|reason| format!("Could not delete record with id {} for user with id {}. Reason: {}", record_id, user_id, reason))
    }

    pub fn delete_expense(&self, maybe_user_id: Option<i32>, expense_id: i32) -> Result<bool, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let expense = expenses::table
                    .filter(expenses::expense_id.eq(expense_id))
                    .filter(expenses::user_id.eq(user_id))
                    .first::<Expense>(&*conn)?;
                let convention = conventions::table
                    .filter(conventions::con_id.eq(expense.con_id))
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

                diesel::delete(expenses::table)
                    .filter(expenses::expense_id.eq(expense_id))
                    .execute(&*conn)
                    .map(|size| size == 1)
            })
            .map_err(|reason| format!("Could not delete expense with id {} for user with id {}. Reason: {}", expense_id, user_id, reason))
    }

    pub fn delete_user_convention(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<bool, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                let convention =
                    conventions::table
                        .filter(conventions::con_id.eq(con_id))
                        .first::<DetachedConvention>(&*conn)?;

                if convention.start_date.and_hms(0, 0, 0) > Utc::now().naive_utc() {
                    return Err(
                        diesel::result::Error::DeserializationError(
                            Box::new(
                                ::error::StringError(
                                    format!("Convention with id {} has already started", convention.con_id)
                                )
                            )
                        )
                    )
                }

                diesel::delete(user_conventions::table)
                    .filter(user_conventions::user_id.eq(user_id))
                    .filter(user_conventions::con_id.eq(con_id))
                    .execute(&*conn)
                    .map(|size| size == 1)
            })
            .map_err(|reason| format!("Could not delete user_convention with convention id {} and user id {}. Reason: {}", con_id, user_id, reason))
    }
}
