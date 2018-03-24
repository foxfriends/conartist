//! Holds information about a user and their products, prices, and conventions
use juniper::FieldResult;
use chrono::{DateTime, Utc};

use database::Database;
use database::models::*;

mod product_type;
mod product;
mod price;
mod record;
mod expense;
mod user_convention;
mod settings;

graphql_object!(User: Database |&self| {
    description: "Holds information about a user and their products, prices, and conventions"

    field id() -> i32 { self.user_id }
    field name() -> &String { &self.name }
    field email() -> &String { &self.email }
    field keys() -> i32 { self.keys }
    field join_date() -> DateTime<Utc> { DateTime::from_utc(self.join_date, Utc) }

    field product_types(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_product_types_for_user(self.user_id)
        }
    }

    field products(&executor) -> FieldResult<Vec<ProductInInventory>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user(self.user_id)
        }
    }

    field prices(&executor) -> FieldResult<Vec<Price>> {
        dbtry! {
            executor
                .context()
                .get_prices_for_user(self.user_id)
        }
    }

    field conventions(&executor) -> FieldResult<Vec<FullUserConvention>> {
        dbtry! {
            executor
                .context()
                .get_conventions_for_user(self.user_id)
        }
    }

    field settings(&executor) -> FieldResult<Settings> {
        dbtry! {
            executor
                .context()
                .get_settings_for_user(self.user_id)
        }
    }
});
