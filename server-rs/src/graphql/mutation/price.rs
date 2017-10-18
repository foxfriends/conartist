//! Input objects needed to modify prices
use super::super::common::PriceRow;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new price")]
pub struct PriceAdd {
    type_id: i32,
    product_id: Option<i32>,
    prices: Vec<PriceRow>,
}

#[derive(Clone, Copy, GraphQLInputObject)]
#[graphql(description="Information required to delete an existing price")]
pub struct PriceDel {
    type_id: i32,
    product_id: Option<i32>,
}
