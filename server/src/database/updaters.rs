//! Methods for updating the database with
use diesel::{self, dsl, sql_types};
use diesel::prelude::*;

use super::Database;
use super::models::*;
use super::schema::*;
use crate::money::Money;

impl Database {
    pub fn update_record(&self, maybe_user_id: Option<i32>, record_id: i32, products: Option<Vec<i32>>, price: Option<Money>, info: Option<String>) -> Result<Record, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                diesel::update(records::table)
                    .filter(records::record_id.eq(record_id))
                    .filter(records::user_id.eq(user_id))
                    .set(&RecordChanges::new(products, price, info))
                    .get_result::<Record>(&*conn)
            })
            .map_err(|reason| format!("Could not update record with id {}. Reason: {}", record_id, reason))
    }

    pub fn update_expense(&self, maybe_user_id: Option<i32>, expense_id: i32, category: Option<String>, price: Option<Money>, description: Option<String>) -> Result<Expense, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                diesel::update(expenses::table)
                    .filter(expenses::expense_id.eq(expense_id))
                    .filter(expenses::user_id.eq(user_id))
                    .set(&ExpenseChanges::new(category, description, price))
                    .get_result::<Expense>(&*conn)
            })
            .map_err(|reason| format!("Could not update expense with id {}. Reason: {}", expense_id, reason))
    }

    pub fn update_convention_user_info_vote(&self, maybe_user_id: Option<i32>, info_id: i32, approved: bool) -> Result<ConventionUserInfo, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
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
}
