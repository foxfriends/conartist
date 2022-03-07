//! Input objects needed to modify product types
use juniper::GraphQLInputObject;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to create a new webhook")]
pub struct CreateWebhook {
    pub url: String,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to delete a webhook")]
pub struct DeleteWebhook {
    pub id: i32,
}
