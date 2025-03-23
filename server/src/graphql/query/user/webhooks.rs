//! Holds information about a product
use crate::database::Database;
use crate::database::models::*;
use juniper::{FieldResult, graphql_object};

pub struct Webhooks {
    pub user_id: i32,
}

#[graphql_object]
#[graphql(description = "Webhook called when a recorded sale is deleted")]
impl WebhookDeleteRecord {
    fn id(&self) -> i32 {
        self.webhook_id
    }

    fn url(&self) -> &String {
        &self.url
    }
}

#[graphql_object]
#[graphql(description = "Webhook called when a new sale is recorded")]
impl WebhookNewRecord {
    fn id(&self) -> i32 {
        self.webhook_id
    }
    fn url(&self) -> &String {
        &self.url
    }
}

#[graphql_object]
#[graphql(description = "Grouping for the different types of webhooks")]
impl Webhooks {
    fn new_record(&self, context: &Database) -> FieldResult<Vec<WebhookNewRecord>> {
        dbtry! {
            context.get_webhooks_new_record_for_user(self.user_id)
        }
    }

    fn delete_record(&self, context: &Database) -> FieldResult<Vec<WebhookDeleteRecord>> {
        dbtry! {
            context.get_webhooks_delete_record_for_user(self.user_id)
        }
    }
}
