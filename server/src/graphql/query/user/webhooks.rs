//! Holds information about a product
use crate::database::models::*;
use crate::database::Database;
use juniper::{graphql_object, FieldResult};

pub struct Webhooks {
    pub user_id: i32,
}

graphql_object!(WebhookDeleteRecord: Database as "WebhookDeleteRecord" |&self| {
    description: "Webhook called when a recorded sale is deleted"

    field id() -> i32 { self.webhook_id }
    field url() -> &String { &self.url }
});

graphql_object!(WebhookNewRecord: Database as "WebhookNewRecord" |&self| {
    description: "Webhook called when a new sale is recorded"

    field id() -> i32 { self.webhook_id }
    field url() -> &String { &self.url }
});

graphql_object!(Webhooks: Database as "Webhooks" |&self| {
    description: "Grouping for the different types of webhooks"

    field new_record(&executor) -> FieldResult<Vec<WebhookNewRecord>> {
        dbtry! {
            executor
                .context()
                .get_webhooks_new_record_for_user(self.user_id)
        }
    }

    field delete_record(&executor) -> FieldResult<Vec<WebhookDeleteRecord>> {
        dbtry! {
            executor
                .context()
                .get_webhooks_delete_record_for_user(self.user_id)
        }
    }
});
