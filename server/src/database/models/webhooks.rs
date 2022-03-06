//! Webhook tables
use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct WebhookNewRecord {
    pub webhook_id: i32,
    pub user_id: i32,
    pub url: String,
}

#[derive(Queryable, Clone, Debug)]
pub struct WebhookDeleteRecord {
    pub webhook_id: i32,
    pub user_id: i32,
    pub url: String,
}
