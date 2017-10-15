//! Contains information about a User
use chrono::NaiveDateTime;
use juniper::FieldResult;
use database::Database;
pub use database::{User, ProductType, Product};

// TODO: un-stub these
type Price = bool;
type Convention = bool;

graphql_object!(User: Database |&self| {
    description: "Holds information about a user and their products, prices, and conventions"

    field id() -> i32 { self.user_id }
    field email() -> &String { &self.email }
    field keys() -> i32 { self.keys }
    field join_date() -> NaiveDateTime { self.join_date }

    field product_types(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_product_types_for_user(self.user_id)
        }
    }
    field products(&executor) -> FieldResult<Vec<Product>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user(self.user_id)
        }
    }
    field prices() -> Vec<Price> { vec![] }
    field conventions() -> Vec<Convention> { vec![] }
});
