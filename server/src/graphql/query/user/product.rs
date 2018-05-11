//! Holds information about a product
use database::Database;
use database::models::*;

graphql_object!(ProductWithQuantity: Database as "Product" |&self| {
    description: "Holds information about a product"

    field id() -> i32 { self.product_id }
    field type_id() -> i32 { self.type_id }
    field name() -> &String { &self.name }
    field discontinued() -> bool { self.discontinued }
    field quantity() -> i32 { self.quantity as i32 }
    field sort() -> i32 { self.sort }
});
