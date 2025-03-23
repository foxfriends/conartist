use diesel::{self, prelude::*};
use log::warn;
use reqwest::blocking::Client;
use serde_json::json;

use super::Database;
use super::models::*;
use super::schema::*;

impl Database {
    pub fn get_webhooks_new_record_for_user(
        &self,
        user_id: i32,
    ) -> Result<Vec<WebhookNewRecord>, String> {
        let mut conn = self.pool.get().unwrap();
        webhooknewrecord::table
            .filter(webhooknewrecord::user_id.eq(user_id))
            .load::<WebhookNewRecord>(&mut conn)
            .map_err(|reason| {
                format!(
                    "WebhookNewRecord for user {} could not be loaded: {}",
                    user_id, reason
                )
            })
    }

    pub fn get_webhooks_delete_record_for_user(
        &self,
        user_id: i32,
    ) -> Result<Vec<WebhookDeleteRecord>, String> {
        let mut conn = self.pool.get().unwrap();
        webhookdeletedrecord::table
            .filter(webhookdeletedrecord::user_id.eq(user_id))
            .load::<WebhookDeleteRecord>(&mut conn)
            .map_err(|reason| {
                format!(
                    "WebhookDeleteRecord for user {} could not be loaded: {}",
                    user_id, reason
                )
            })
    }

    pub fn create_webhook_new_record(
        &self,
        maybe_user_id: Option<i32>,
        url: String,
    ) -> Result<WebhookNewRecord, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> diesel::result::QueryResult<WebhookNewRecord> {
            let webhook = diesel::insert_into(webhooknewrecord::table)
                .values((
                    webhooknewrecord::user_id.eq(user_id),
                    webhooknewrecord::url.eq(url),
                ))
                .get_result::<WebhookNewRecord>(conn)?;
            Ok(webhook)
        })
        .map_err(|reason| {
            format!(
                "Failed to create new webhooknewrecord for user with id {}. Reason: {}",
                user_id, reason
            )
        })
    }

    pub fn create_webhook_delete_record(
        &self,
        maybe_user_id: Option<i32>,
        url: String,
    ) -> Result<WebhookDeleteRecord, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> diesel::result::QueryResult<WebhookDeleteRecord> {
            let webhook = diesel::insert_into(webhookdeletedrecord::table)
                .values((
                    webhookdeletedrecord::user_id.eq(user_id),
                    webhookdeletedrecord::url.eq(url),
                ))
                .get_result::<WebhookDeleteRecord>(conn)?;
            Ok(webhook)
        })
        .map_err(|reason| {
            format!(
                "Failed to create new webhookdeletedrecord for user with id {}. Reason: {}",
                user_id, reason
            )
        })
    }

    pub fn delete_webhook_new_record(
        &self,
        maybe_user_id: Option<i32>,
        webhook_id: i32,
    ) -> Result<bool, String> {
        self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> diesel::result::QueryResult<bool> {
            diesel::delete(webhooknewrecord::table)
                .filter(webhooknewrecord::webhook_id.eq(webhook_id))
                .execute(conn)?;
            Ok(true)
        })
        .map_err(|reason| {
            format!(
                "Could not delete WebhookNewRecord with id {}. Reason: {}",
                webhook_id, reason
            )
        })
    }

    pub fn delete_webhook_delete_record(
        &self,
        maybe_user_id: Option<i32>,
        webhook_id: i32,
    ) -> Result<bool, String> {
        self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> diesel::result::QueryResult<bool> {
            diesel::delete(webhookdeletedrecord::table)
                .filter(webhookdeletedrecord::webhook_id.eq(webhook_id))
                .execute(conn)?;
            Ok(true)
        })
        .map_err(|reason| {
            format!(
                "Could not delete WebhookDeleteRecord with id {}. Reason: {}",
                webhook_id, reason
            )
        })
    }

    pub fn trigger_webhook_new_record(&self, record: &Record) -> Result<(), String> {
        let mut conn = self.pool.get().unwrap();
        let hooks = webhooknewrecord::table
            .filter(webhooknewrecord::user_id.eq(record.user_id))
            .load::<WebhookNewRecord>(&mut conn)
            .map_err(|reason| {
                format!(
                    "WebhookNewRecord for user {} could not be loaded: {}",
                    record.user_id, reason
                )
            })?;

        let record_products = products::table
            .filter(products::product_id.eq_any(&record.products))
            .load::<Product>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Products for record {} could not be loaded: {}",
                    record.record_id, reason,
                )
            })?;

        let body = json! ({
            "record_id": record.record_id,
            "con_id": record.con_id,
            "price": record.price,
            "products": record_products
                .into_iter()
                .map(|product| json!({
                    "product_id": product.product_id,
                    "type_id": product.type_id,
                    "name": product.name,
                    "sku": product.sku,
                    "quantity": record.products.iter().filter(|id| **id == product.product_id).count(),
                }))
                .collect::<Vec<_>>(),
            "info": record.info,
            "sale_time": record.sale_time.0,
            "event": "create",
        });

        std::thread::spawn(move || {
            let client = Client::new();
            for hook in hooks {
                if let Err(error) = client.post(&hook.url).json(&body).send() {
                    warn!("Failed to send webhook to {}. Reason: {}", hook.url, error);
                }
            }
        });

        Ok(())
    }

    pub fn trigger_webhook_delete_record(&self, record: &Record) -> Result<(), String> {
        let mut conn = self.pool.get().unwrap();

        let hooks = webhookdeletedrecord::table
            .filter(webhookdeletedrecord::user_id.eq(record.user_id))
            .load::<WebhookDeleteRecord>(&mut conn)
            .map_err(|reason| {
                format!(
                    "WebhookDeleteRecord for user {} could not be loaded: {}",
                    record.user_id, reason
                )
            })?;

        let record_products = products::table
            .filter(products::product_id.eq_any(&record.products))
            .load::<Product>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Products for record {} could not be loaded: {}",
                    record.record_id, reason,
                )
            })?;

        let body = json! ({
            "record_id": record.record_id,
            "con_id": record.con_id,
            "price": record.price,
            "products": record_products
                .into_iter()
                .map(|product| json!({
                    "product_id": product.product_id,
                    "type_id": product.type_id,
                    "name": product.name,
                    "sku": product.sku,
                }))
                .collect::<Vec<_>>(),
            "info": record.info,
            "sale_time": record.sale_time.0,
            "event": "delete",
        });

        std::thread::spawn(move || {
            let client = Client::new();
            for hook in hooks {
                if let Err(error) = client.post(&hook.url).json(&body).send() {
                    warn!("Failed to send webhook to {}. Reason: {}", hook.url, error);
                }
            }
        });

        Ok(())
    }
}
