//! Holds information about a product type
use database::Database;
use database::models::*;

graphql_object!(ProductType: Database |&self| {
    description: "Holds information about a product type"

    field id() -> i32 { self.type_id }
    field name() -> &String { &self.name }
    field color() -> Option<i32> { self.color }
    field discontinued() -> bool { self.discontinued }
});
