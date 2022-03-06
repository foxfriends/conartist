use diesel::{self, prelude::*};
use log::warn;
use reqwest::blocking::Client;
use serde_json::json;

use super::models::*;
use super::schema::*;
use super::Database;

impl Database {
    pub fn trigger_webhook_new_record(&self, record: &Record) -> Result<(), String> {
        let conn = self.pool.get().unwrap();

        let hooks = webhooknewrecord::table
            .filter(webhooknewrecord::user_id.eq(record.user_id))
            .load::<WebhookNewRecord>(&*conn)
            .map_err(|reason| {
                format!(
                    "WebhookNewRecord for user {} could not be loaded: {}",
                    record.user_id, reason
                )
            })?;

        let record_products = products::table
            .filter(products::product_id.eq_any(&record.products))
            .load::<Product>(&*conn)
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
        let conn = self.pool.get().unwrap();

        let hooks = webhookdeletedrecord::table
            .filter(webhookdeletedrecord::user_id.eq(record.user_id))
            .load::<WebhookDeleteRecord>(&*conn)
            .map_err(|reason| {
                format!(
                    "WebhookNewRecord for user {} could not be loaded: {}",
                    record.user_id, reason
                )
            })?;

        let record_products = products::table
            .filter(products::product_id.eq_any(&record.products))
            .load::<Product>(&*conn)
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
