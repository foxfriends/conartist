//! Holds information about the price of a product or product type
use crate::database::models::*;
use crate::money::Money;
use juniper::graphql_object;

#[graphql_object]
impl Price {
    fn price_id(&self) -> i32 {
        self.price_id
    }

    fn type_id(&self) -> i32 {
        self.type_id
    }

    fn product_id(&self) -> Option<i32> {
        self.product_id
    }

    fn quantity(&self) -> i32 {
        self.quantity
    }

    fn price(&self) -> Money {
        self.price.unwrap()
    }
}
