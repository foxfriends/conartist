//! Type definitions for all tables in the database
use std::panic::catch_unwind;
use postgres::rows::Row;
use juniper::ResultExt;
use chrono::NaiveDateTime;

pub struct User {
    pub user_id: i32,
    pub email: String,
    pub password: String,
    pub keys: i32,
    pub join_date: NaiveDateTime,
}
impl User {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                user_id: row.get(0),
                email: row.get(1),
                password: row.get(2),
                keys: row.get(3),
                join_date: row.get(4),
            }
        }).map_err(|_| "Tried to create a User from a non-User row".to_string())
    }
}

pub struct Convention {
    pub con_id: i32,
    pub code: String,
    pub title: String,
    pub start_date: i32,
    pub end_date: i32,
}

pub struct UserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
}

pub struct Product {
    pub product_id: i32,
    pub user_id: i32,
    pub type_id: i32,
    pub name: String,
    pub discontinued: bool,
}
impl Product {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                product_id: row.get(0),
                user_id: row.get(1),
                type_id: row.get(2),
                name: row.get(3),
                discontinued: row.get(4),
            }
        }).map_err(|_| "Tried to create a Product from a non-Product row".to_string())
    }
}

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
                type_id: row.get(0),
                user_id: row.get(1),
                name: row.get(2),
                color: row.get(3),
                discontinued: row.get(4),
            }
        }).map_err(|_| "Tried to create a ProductType from a non-ProductType row".to_string())
    }
}

pub struct InventoryItem {
    pub inv_id: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub product_id: i32,
    pub quantity: i32,
}

pub struct Price {
    pub price_id: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub prices: Vec<(i32, f64)>,
}

pub struct Record {
    pub record_id: i32,
    pub user_con_id: i32,
    pub price: f64,
    pub products: Vec<i32>,
    pub sale_time: i32,
}

pub struct Expense {
    pub expense_id: i32,
    pub user_con_id: i32,
    pub price: f64,
    pub category: String,
    pub description: String,
    pub spend_time: i32,
}
