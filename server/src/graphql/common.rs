use money::Money;
use serde_json;

#[derive(Clone, Copy, GraphQLInputObject, Serialize, Deserialize)]
#[graphql(description="A Quantity-Price pair to represent part of a full pricing scheme of a product/product type")]
pub struct PricePairIn {
    pub quantity: i32,
    pub price: Money,
}

impl Into<serde_json::Value> for PricePairIn {
    fn into(self) -> serde_json::Value {
        json!(
            [ self.quantity, self.price ]
        )
    }
}

#[derive(Clone, Copy, GraphQLObject)]
#[graphql(description="A Quantity-Price pair to represent part of a full pricing scheme of a product/product type")]
pub struct PricePairOut {
    pub quantity: i32,
    pub price: Money,
}
