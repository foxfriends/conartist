//! Holds information about the price of a product or product type
use database::Database;
pub use database::{Price, PriceRow};

pub struct PricePair(i32, f64);

graphql_object!(PricePair: Database |&self| {
    field quantity() -> i32 { self.0 }
    field price() -> f64 { self.1 }
});

graphql_object!(Price: Database |&self| {
    description: "Holds information about the price of a product or product type"

    field id() -> i32 { self.price_id }
    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field prices() -> Vec<PricePair> { self.prices.iter().map(|&(q, p)| PricePair(q, p)).collect() }
});

graphql_object!(PriceRow: Database |&self| {
    field index() -> i32 { self.index }
    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field quantity() -> i32 { self.quantity }
    field price() -> f64 { self.price }
});
