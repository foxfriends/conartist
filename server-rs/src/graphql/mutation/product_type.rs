//! Input objects needed to modify product types

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new product type")]
pub struct ProductTypeAdd {
    name: String,
    color: i32,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify an existing product type")]
pub struct ProductTypeMod {
    type_id: i32,
    name: Option<String>,
    color: Option<i32>,
    discontinued: Option<bool>,
}
