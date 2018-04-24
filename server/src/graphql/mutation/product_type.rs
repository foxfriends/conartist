//! Input objects needed to modify product types
#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a new product type")]
pub struct ProductTypeAdd {
    pub name: String,
    pub color: i32,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify an existing product type")]
pub struct ProductTypeMod {
    pub type_id: i32,
    pub name: Option<String>,
    pub color: Option<i32>,
    pub discontinued: Option<bool>,
}
