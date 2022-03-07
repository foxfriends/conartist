//! Holds information about a convention
use chrono::{DateTime, Utc};
use juniper::{graphql_object, FieldResult};

mod connection;
mod extra_info;
mod image;
mod user_info;

use crate::database::models::*;
use crate::database::Database;
use crate::money::Money;

graphql_object!(Convention: Database |&self| {
    description: "Holds information about a convention and a user's records at that convention"

    field id() -> i32 { self.con_id }
    field name() -> &String { &self.title }
    field start() -> DateTime<Utc> { DateTime::from_utc(self.start_date.and_hms(0, 0, 0), Utc) }
    field end() -> DateTime<Utc> { DateTime::from_utc(self.end_date.and_hms(23, 59, 59), Utc) }

    field images(&executor) -> FieldResult<Vec<ConventionImage>> {
        dbtry! {
            executor
                .context()
                .get_images_for_convention(self.con_id)
        }
    }

    field extra_info(&executor) -> FieldResult<Vec<ConventionExtraInfo>> {
        dbtry! {
            executor
                .context()
                .get_convention_extra_info_for_convention(self.con_id)
        }
    }

    field user_info(&executor) -> FieldResult<Vec<ConventionUserInfo>> {
        dbtry! {
            executor
                .context()
                .get_convention_user_info_for_convention(self.con_id)
        }
    }

    field product_types(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_all_product_types_for_user(self.user_id)
        }
    }

    field products(&executor) -> FieldResult<Vec<ProductWithQuantity>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user_con(self.user_id, self.con_id)
        }
    }

    field prices(&executor) -> FieldResult<Vec<Price>> {
        dbtry! {
            executor
                .context()
                .get_prices_for_user_con(self.user_id, self.con_id)
        }
    }

    field records(&executor) -> FieldResult<Vec<Record>> {
        dbtry! {
            executor
                .context()
                .get_records_for_user_con(self.user_id, self.con_id)
        }
    }

    field expenses(&executor) -> FieldResult<Vec<Expense>> {
        dbtry! {
            executor
                .context()
                .get_expenses_for_user_con(self.user_id, self.con_id)
        }
    }

    field record_total(&executor) -> FieldResult<Option<Money>> {
        dbtry! {
            executor
                .context()
                .get_records_for_user_con(self.user_id, self.con_id)
                .map(|records| {
                    records
                        .into_iter()
                        .map(|record| record.price)
                        .fold(None, |b, a| { b.map(|b| { a + b }).or(Some(a)) })
                })
        }
    }

    field expense_total(&executor) -> FieldResult<Option<Money>> {
        dbtry! {
            executor
                .context()
                .get_expenses_for_user_con(self.user_id, self.con_id)
                .map(|expenses| {
                    expenses
                        .into_iter()
                        .map(|expense| expense.price)
                        .fold(None, |b, a| { b.map(|b| { a + b }).or(Some(a)) })
                })
        }
    }
});
