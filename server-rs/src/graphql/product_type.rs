//! Contains information about a ProductType
use database::Database;
pub use database::ProductType;

graphql_object!(ProductType: Database |&self| {
    description: "Holds information about a product type"

    field type_id() -> i32 { self.type_id }
    field name() -> &String { &self.name }
    field color() -> i32 { self.color }
    field discontinued() -> bool { self.discontinued }
});
