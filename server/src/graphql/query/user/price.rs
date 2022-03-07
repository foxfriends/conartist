//! Holds information about the price of a product or product type
use crate::database::models::*;
use crate::database::Database;
use crate::money::Money;
use juniper::graphql_object;

graphql_object!(Price: Database |&self| {
    field price_id() -> i32 { self.price_id }
    field type_id() -> i32 { self.type_id }
    field product_id() -> Option<i32> { self.product_id }
    field quantity() -> i32 { self.quantity }
    field price() -> Money { self.price.unwrap() }
});
