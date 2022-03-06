//! Input objects needed to modify products
use juniper::GraphQLInputObject;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new product")]
pub struct ProductAdd {
    pub type_id: i32,
    pub name: String,
    pub sku: Option<String>,
    pub quantity: i32,
    pub sort: i32,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify an existing product")]
pub struct ProductMod {
    pub product_id: i32,
    pub name: Option<String>,
    pub sku: Option<String>,
    pub quantity: Option<i32>,
    pub discontinued: Option<bool>,
    pub sort: Option<i32>,
}
