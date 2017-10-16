//! Holds information about a user and their products, prices, and conventions
use chrono::NaiveDateTime;
use juniper::FieldResult;
use database::Database;
pub use database::{User, ProductType, ProductInInventory, PriceRow, FullUserConvention};

graphql_object!(User: Database |&self| {
    description: "Holds information about a user and their products, prices, and conventions"

    field id() -> i32 { self.user_id }
    field email() -> &String { &self.email }
    field keys() -> i32 { self.keys }
    field join_date() -> NaiveDateTime { self.join_date }

    field product_type(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_product_types_for_user(self.user_id)
        }
    }

    field product(&executor) -> FieldResult<Vec<ProductInInventory>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user(self.user_id)
        }
    }

    field price(&executor) -> FieldResult<Vec<PriceRow>> {
        dbtry! {
            executor
                .context()
                .get_prices_for_user(self.user_id)
                .map(|prices| prices
                    .into_iter()
                    .fold(vec![], |prev, price| {
                        let len = prev.len() as i32;
                        prev.into_iter().chain(price.spread(len)).collect()
                    })
                )
        }
    }

    field convention(&executor) -> FieldResult<Vec<FullUserConvention>> {
        dbtry! {
            executor
                .context()
                .get_conventions_for_user(self.user_id)
        }
    }
});
