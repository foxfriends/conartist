//! Holds information about a discount
use crate::database::models::*;
use crate::money::Money;
use juniper::graphql_object;

#[graphql_object]
impl Discount {
    fn discount_id(&self) -> i32 {
        self.discount_id
    }

    fn name(&self) -> &String {
        &self.name
    }

    fn product_ids(&self) -> &Vec<i32> {
        &self.product_ids
    }

    fn product_type_ids(&self) -> &Vec<i32> {
        &self.product_type_ids
    }

    fn flat_amount(&self) -> Option<Money> {
        self.flat_amount
    }

    fn percentage_amount(&self) -> Option<f64> {
        self.percentage_amount
    }

    fn deleted(&self) -> bool {
        self.deleted_at.is_some()
    }
}
