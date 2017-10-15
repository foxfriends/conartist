//! Contains information about a User

use database::Database;

pub struct User { id: i32 }

// TODO: un-stub these
type ProductType = bool;
type Product = bool;
type Price = bool;
type Convention = bool;

impl User {
    pub fn new(id: i32) -> Self { Self{ id } }
}

graphql_object!(User: Database |&self| {
    description: "Holds information about a user and their products, prices, and conventions"

    field product_types() -> Vec<ProductType> { vec![] }
    field products() -> Vec<Product> { vec![] }
    field prices() -> Vec<Price> { vec![] }
    field conventions() -> Vec<Convention> { vec![] }
});
