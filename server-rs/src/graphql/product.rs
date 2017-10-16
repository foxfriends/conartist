//! Holds information about a product
use database::Database;
pub use database::ProductInInventory;

graphql_object!(ProductInInventory: Database |&self| {
    description: "Holds information about a product"

    field id() -> i32 { self.product.product_id }
    field type_id() -> i32 { self.product.type_id }
    field name() -> &String { &self.product.name }
    field discontinued() -> bool { self.product.discontinued }
    field quantity() -> i32 { self.inventory.quantity }
});
