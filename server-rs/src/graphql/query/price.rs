//! Holds information about the price of a product or product type
use database::Database;
use super::super::common;
use database::{Price, PriceRow};

graphql_object!(Price: Database |&self| {
    description: "Holds information about the price of a product or product type"

    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field prices() -> Vec<common::PriceRow> { self.prices.iter().map(|&(quantity, price)| common::PriceRow{ quantity, price }).collect() }
});

graphql_object!(PriceRow: Database |&self| {
    field index() -> i32 { self.index }
    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field quantity() -> i32 { self.quantity }
    field price() -> f64 { self.price }
});
