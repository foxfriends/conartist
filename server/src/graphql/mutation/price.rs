//! Input objects needed to modify prices
use crate::money::Money;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new price")]
pub struct PriceAdd {
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub quantity: i32,
    pub price: Money,
}

#[derive(Clone, Copy, GraphQLInputObject)]
#[graphql(description="Information required to delete an existing price")]
pub struct PriceDel {
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub quantity: i32,
}
