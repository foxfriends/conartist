//! Contains information about a Product
use database::Database;
pub use database::Product;

graphql_object!(Product: Database |&self| {
    description: "Holds information about a product"

    field product_id() -> i32 { self.product_id }
    field type_id() -> i32 { self.type_id }
    field name() -> &String { &self.name }
    field discontinued() -> bool { self.discontinued }
});
