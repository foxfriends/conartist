//! Holds information about the price of a product or product type
use super::super::super::common::PricePairOut;
use database::{Database, Price, PriceRow};
use money::Money;

graphql_object!(Price: Database |&self| {
    description: "Holds information about the price of a product or product type"

    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field prices() -> Vec<PricePairOut> { self.prices.iter().map(|&(quantity, price)| PricePairOut{ quantity, price }).collect() }
});

graphql_object!(PriceRow: Database |&self| {
    field index() -> i32 { self.index }
    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field quantity() -> i32 { self.quantity }
    field price() -> Money { self.price }
});
