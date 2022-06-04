//! The Product and Inventory tables
use super::super::schema::*;
use chrono::NaiveDateTime;
use diesel::{AsChangeset, Queryable};

#[derive(Queryable, Clone, Debug)]
pub struct InventoryItem {
    pub inventory_id: i32,
    pub product_id: i32,
    pub quantity: i32,
    pub mod_date: NaiveDateTime,
}

#[derive(Queryable, Clone, Debug)]
pub struct Product {
    pub product_id: i32,
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub sort: i32,
    pub deleted: bool,
    pub sku: Option<String>,
}

impl Product {
    pub fn with_snapshot_data(self, quantity: i64, discontinued: bool) -> ProductSnapshot {
        ProductSnapshot {
            product_id: self.product_id,
            type_id: self.type_id,
            user_id: self.user_id,
            name: self.name,
            sort: self.sort,
            sku: self.sku,
            quantity,
            discontinued,
        }
    }
}

#[derive(AsChangeset, Debug)]
#[table_name = "products"]
pub struct ProductChanges {
    pub name: Option<String>,
    pub sort: Option<i32>,
    pub sku: Option<Option<String>>,
}

#[derive(Queryable, Clone, Debug)]
pub struct ProductSnapshot {
    pub product_id: i32,
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub sort: i32,
    pub sku: Option<String>,
    pub quantity: i64,
    pub discontinued: bool,
}
