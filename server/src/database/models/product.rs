//! The Product and Inventory tables
use chrono::NaiveDateTime;
use diesel::{Queryable, AsChangeset};
use super::super::schema::*;

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
    pub discontinued: bool,
    pub sort: i32,
    pub deleted: bool,
    pub sku: Option<String>,
}

impl Product {
    pub fn with_quantity(self, quantity: i64) -> ProductWithQuantity {
        ProductWithQuantity {
            product_id: self.product_id,
            type_id: self.type_id,
            user_id: self.user_id,
            name: self.name,
            sort: self.sort,
            discontinued: self.discontinued,
            sku: self.sku,
            quantity,
        }
    }
}

#[derive(Queryable, Clone, Debug)]
pub struct ProductWithQuantity {
    pub product_id: i32,
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub sort: i32,
    pub discontinued: bool,
    pub sku: Option<String>,
    pub quantity: i64,
}

#[derive(AsChangeset, Debug)]
#[table_name="products"]
pub struct ProductChanges {
    pub name: Option<String>,
    pub discontinued: Option<bool>,
    pub sort: Option<i32>,
    pub sku: Option<Option<String>>,
}
