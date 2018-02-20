//! The ProductTypes table
use std::panic::catch_unwind;
use postgres::rows::Row;

#[derive(Clone)]
pub struct ProductType {
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub color: i32,
    pub discontinued: bool,
}
impl ProductType {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                type_id: row.get("type_id"),
                user_id: row.get("user_id"),
                name: row.get("name"),
                color: row.get("color"),
                discontinued: row.get("discontinued"),
            }
        }).map_err(|_| "Tried to create a ProductType from a non-ProductType row".to_string())
    }
}
