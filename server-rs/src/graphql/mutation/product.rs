//! Input objects needed to modify products

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new product")]
pub struct ProductAdd {
    type_id: i32,
    name: String,
    quantity: i32,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify an existing product")]
pub struct ProductMod {
    product_id: i32,
    name: Option<String>,
    quantity: Option<i32>,
    discontinued: Option<bool>,
}
