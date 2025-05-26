//! Holds information about a convention
use chrono::{DateTime, Utc};
use juniper::{FieldResult, graphql_object};

mod connection;
mod extra_info;
mod image;
mod user_info;

use crate::database::Database;
use crate::database::models::*;
use crate::money::Money;

#[graphql_object]
#[graphql(
    description = "Holds information about a convention and a user's records at that convention"
)]
impl Convention {
    fn id(&self) -> i32 {
        self.con_id
    }
    fn name(&self) -> &String {
        &self.title
    }
    fn start(&self) -> DateTime<Utc> {
        DateTime::from_naive_utc_and_offset(self.start_date.and_hms_opt(0, 0, 0).unwrap(), Utc)
    }
    fn end(&self) -> DateTime<Utc> {
        DateTime::from_naive_utc_and_offset(self.end_date.and_hms_opt(23, 59, 59).unwrap(), Utc)
    }

    fn images(&self, context: &Database) -> FieldResult<Vec<ConventionImage>> {
        dbtry! {
            context
                .get_images_for_convention(self.con_id)
        }
    }

    fn extra_info(&self, context: &Database) -> FieldResult<Vec<ConventionExtraInfo>> {
        dbtry! {
            context
                .get_convention_extra_info_for_convention(self.con_id)
        }
    }

    fn user_info(&self, context: &Database) -> FieldResult<Vec<ConventionUserInfo>> {
        dbtry! {
            context
                .get_convention_user_info_for_convention(self.con_id)
        }
    }

    fn product_types(&self, context: &Database) -> FieldResult<Vec<ProductTypeSnapshot>> {
        dbtry! {
            context
                .get_all_product_types_for_user(self.user_id, Some(DateTime::from_naive_utc_and_offset(self.end_date.and_hms_opt(23, 59, 59).unwrap(), Utc)))
        }
    }

    fn products(&self, context: &Database) -> FieldResult<Vec<ProductSnapshot>> {
        dbtry! {
            context
                .get_products_for_user_con(self.user_id, self.con_id)
        }
    }

    fn prices(&self, context: &Database) -> FieldResult<Vec<Price>> {
        dbtry! {
            context
                .get_prices_for_user_con(self.user_id, self.con_id)
        }
    }

    fn records(&self, context: &Database) -> FieldResult<Vec<Record>> {
        dbtry! {
            context
                .get_records_for_user_con(self.user_id, self.con_id)
        }
    }

    fn expenses(&self, context: &Database) -> FieldResult<Vec<Expense>> {
        dbtry! {
            context
                .get_expenses_for_user_con(self.user_id, self.con_id)
        }
    }

    fn record_total(&self, context: &Database) -> FieldResult<Option<Money>> {
        dbtry! {
            context
                .get_records_for_user_con(self.user_id, self.con_id)
                .map(|records| {
                    records
                        .into_iter()
                        .map(|record| record.price)
                        .fold(None, |b, a| { b.map(|b| { a + b }).or(Some(a)) })
                })
        }
    }

    fn expense_total(&self, context: &Database) -> FieldResult<Option<Money>> {
        dbtry! {
            context
                .get_expenses_for_user_con(self.user_id, self.con_id)
                .map(|expenses| {
                    expenses
                        .into_iter()
                        .map(|expense| expense.price)
                        .fold(None, |b, a| { b.map(|b| { a + b }).or(Some(a)) })
                })
        }
    }
}
