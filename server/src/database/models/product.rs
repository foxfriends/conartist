//! The Product and Inventory tables
use chrono::NaiveDateTime;

#[derive(Queryable, Clone)]
pub struct InventoryItem {
    pub inventory_id: i32,
    pub product_id: i32,
    pub quantity: i32,
    pub mod_date: NaiveDateTime,
}

#[derive(Queryable, Clone)]
pub struct Product {
    pub product_id: i32,
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub discontinued: bool,
}
