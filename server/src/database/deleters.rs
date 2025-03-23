use diesel::prelude::*;
use diesel::{self, dsl};
use uuid::Uuid;

use super::Database;
use super::models::*;
use super::schema::*;
use crate::money::Money;

impl Database {
    pub fn delete_price(
        &self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        product_id: Option<i32>,
        quantity: i32,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        diesel::insert_into(prices::table)
            .values((
                prices::user_id.eq(user_id),
                prices::type_id.eq(type_id),
                prices::product_id.eq(product_id),
                prices::quantity.eq(quantity),
                prices::price.eq(None::<Money>),
            ))
            .execute(&mut conn)
            .map_err(|reason| {
                format!(
                    "Could not delete price for user with id {}. Reason: {}",
                    user_id, reason
                )
            })
            .map(|size| size == 1)
    }

    pub fn delete_record(
        &self,
        maybe_user_id: Option<i32>,
        record_id: Option<i32>,
        uuid: Option<Uuid>,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let record = if let Some(record_id) = record_id {
                records::table
                    .filter(records::record_id.eq(record_id))
                    .filter(records::user_id.eq(user_id))
                    .first::<Record>(conn)?
            } else if let Some(uuid) = uuid {
                records::table
                    .filter(records::gen_id.eq(uuid))
                    .filter(records::user_id.eq(user_id))
                    .first::<Record>(conn)?
            } else {
                return Err(diesel::result::Error::DeserializationError(Box::new(
                    crate::error::StringError(
                        "Could not retrieve record with no id or uuid".to_owned(),
                    ),
                )));
            };

            diesel::delete(records::table)
                .filter(records::record_id.eq(record.record_id))
                .execute(conn)
                .map(|size| size == 1)
        })
        .map_err(|reason| {
            format!(
                "Could not delete record with id {:?} or uuid {:?} for user with id {}. Reason: {}",
                record_id, uuid, user_id, reason
            )
        })
    }

    pub fn delete_expense(
        &self,
        maybe_user_id: Option<i32>,
        expense_id: Option<i32>,
        uuid: Option<Uuid>,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
                let expense =
                    if let Some(expense_id) = expense_id {
                        expenses::table
                            .filter(expenses::expense_id.eq(expense_id))
                            .filter(expenses::user_id.eq(user_id))
                            .first::<Expense>(conn)?
                    } else if let Some(uuid) = uuid {
                        expenses::table
                            .filter(expenses::gen_id.eq(uuid))
                            .filter(expenses::user_id.eq(user_id))
                            .first::<Expense>(conn)?
                    } else {
                        return Err(
                            diesel::result::Error::DeserializationError(
                                Box::new(
                                    crate::error::StringError(
                                        "Could not retrieve expense with no id or uuid".to_owned()
                                    )
                                )
                            )
                        )
                    };

                diesel::delete(expenses::table)
                    .filter(expenses::expense_id.eq(expense.expense_id))
                    .execute(conn)
                    .map(|size| size == 1)
            })
            .map_err(|reason| format!("Could not delete expense with id {:?} or uuid {:?} for user with id {}. Reason: {}", expense_id, uuid, user_id, reason))
    }

    pub fn delete_user_convention(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let convention = conventions::table
                .filter(conventions::con_id.eq(con_id))
                .first::<DetachedConvention>(conn)?;

            let has_records = dsl::select(dsl::exists(
                records::table
                    .filter(records::user_id.eq(user_id))
                    .filter(records::con_id.eq(con_id)),
            ))
            .first::<bool>(conn)?;
            let has_expenses = dsl::select(dsl::exists(
                expenses::table
                    .filter(expenses::user_id.eq(user_id))
                    .filter(expenses::con_id.eq(con_id)),
            ))
            .first::<bool>(conn)?;
            if has_records || has_expenses {
                return Err(diesel::result::Error::DeserializationError(Box::new(
                    crate::error::StringError(format!(
                        "Convention with id {} has already started",
                        convention.con_id
                    )),
                )));
            }

            diesel::delete(user_conventions::table)
                .filter(user_conventions::user_id.eq(user_id))
                .filter(user_conventions::con_id.eq(con_id))
                .execute(conn)
                .map(|size| size == 1)
        })
        .map_err(|reason| {
            format!(
                "Could not delete user_convention with convention id {} and user id {}. Reason: {}",
                con_id, user_id, reason
            )
        })
    }
}
