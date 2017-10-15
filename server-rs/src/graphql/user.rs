//! Contains information about a User
use chrono::NaiveDateTime;
use database::Database;
pub use database::User;

// TODO: un-stub these
type ProductType = bool;
type Product = bool;
type Price = bool;
type Convention = bool;

graphql_object!(User: Database |&self| {
    description: "Holds information about a user and their products, prices, and conventions"

    field id() -> i32 { self.user_id }
    field email() -> &String { &self.email }
    field keys() -> i32 { self.keys }
    field join_date() -> NaiveDateTime { self.join_date }

    field product_types() -> Vec<ProductType> { vec![] }
    field products() -> Vec<Product> { vec![] }
    field prices() -> Vec<Price> { vec![] }
    field conventions() -> Vec<Convention> { vec![] }
});
