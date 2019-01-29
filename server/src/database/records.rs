use diesel::{self, prelude::*, dsl, sql_types};
use chrono::{DateTime, FixedOffset};
use uuid::Uuid;

use super::schema::*;
use super::models::*;
use super::Database;
use crate::money::Money;

impl Database {
    pub fn create_user_record(
        &self,
        maybe_user_id: Option<i32>,
        con_id: Option<i32>,
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
        .map_err(|reason| format!("Could not create record for user with id {} and convention with id {:?}. Reason: {}", user_id, con_id, reason))
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

    pub fn get_records_for_user_con(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Vec<Record>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        records::table
            .filter(records::user_id.eq(user_id))
            .filter(records::con_id.eq(con_id))
            .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").asc())
            .load::<Record>(&*conn)
            .map_err(|reason| format!("Records for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))
    }

    pub fn get_records_for_user(&self, maybe_user_id: Option<i32>, limit: i64, before: Option<i32>) -> Result<Vec<Record>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        if let Some(latest) = before {
            records::table
                .filter(records::user_id.eq(user_id))
                .filter(records::con_id.is_null())
                .filter(records::record_id.lt(latest))
                .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").desc())
                .limit(limit)
                .load::<Record>(&*conn)
                .map_err(|reason| format!("Records for user with id {} could not be retrieved. Reason: {}", user_id, reason))
        } else {
            records::table
                .filter(records::user_id.eq(user_id))
                .filter(records::con_id.is_null())
                .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").desc())
                .limit(limit)
                .load::<Record>(&*conn)
                .map_err(|reason| format!("Records for user with id {} could not be retrieved. Reason: {}", user_id, reason))
        }
    }

    pub fn count_records_for_user(&self, maybe_user_id: Option<i32>) -> i64 {
        let user_id = match self.resolve_user_id_protected(maybe_user_id) {
            Ok(user_id) => user_id,
            Err(..) => return 0,
        };
        let conn = self.pool.get().unwrap();
        records::table
            .select(dsl::count(records::record_id))
            .filter(records::user_id.eq(user_id))
            .filter(records::con_id.is_null())
            .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").desc())
            .count()
            .first::<i64>(&*conn)
            .unwrap_or(0)
    }

    pub fn get_expenses_for_user_con(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Vec<Expense>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        expenses::table
            .filter(expenses::user_id.eq(user_id))
            .filter(expenses::con_id.eq(con_id))
            .order(dsl::sql::<sql_types::Timestamptz>("spend_time::timestamptz").asc())
            .load::<Expense>(&*conn)
            .map_err(|reason| format!("Expenses for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))
    }
}
