//! Input objects needed to modify prices
use super::super::common::PricePairIn;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new price")]
pub struct PriceAdd {
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub prices: Vec<PricePairIn>,
}

#[derive(Clone, Copy, GraphQLInputObject)]
#[graphql(description="Information required to delete an existing price")]
pub struct PriceDel {
    pub type_id: i32,
    pub product_id: Option<i32>,
}
