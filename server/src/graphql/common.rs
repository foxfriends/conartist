#[derive(Clone, Copy, GraphQLInputObject)]
#[graphql(description="A Quantity-Price pair to represent part of a full pricing scheme of a product/product type")]
pub struct PricePairIn {
    pub quantity: i32,
    pub price: f64,
}

#[derive(Clone, Copy, GraphQLObject)]
#[graphql(description="A Quantity-Price pair to represent part of a full pricing scheme of a product/product type")]
pub struct PricePairOut {
    pub quantity: i32,
    pub price: f64,
}
