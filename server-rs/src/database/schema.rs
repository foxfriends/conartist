//! Type definitions for all tables in the database
use std::panic::catch_unwind;
use postgres::rows::Row;
use chrono::NaiveDateTime;

pub struct User {
    pub user_id: i32,
    pub email: String,
    pub password: String,
    pub keys: i32,
    pub join_date: NaiveDateTime,
}
impl User {
    pub fn from(row: Row) -> Option<Self> {
        catch_unwind(|| {
            User {
                user_id: row.get(0),
                email: row.get(1),
                password: row.get(2),
                keys: row.get(3),
                join_date: row.get(4),
            }
        }).ok()
    }
}

pub struct Convention {
    con_id: i32,
    code: String,
    title: String,
    start_date: i32,
    end_date: i32,
}

pub struct UserConvention {
    user_con_id: i32,
    user_id: i32,
    con_id: i32,
}

pub struct Product {
    product_id: i32,
    user_id: i32,
    type_id: i32,
    name: String,
    discontinued: bool,
}

pub struct ProductType {
    type_id: i32,
    user_id: i32,
    name: String,
    color: u32,
    discontinued: bool,
}

pub struct InventoryItem {
    inv_id: i32,
    user_id: Option<i32>,
    user_con_id: Option<i32>,
    product_id: i32,
    quantity: i32,
}

pub struct Price {
    price_id: i32,
    user_id: Option<i32>,
    user_con_id: Option<i32>,
    type_id: i32,
    product_id: Option<i32>,
    prices: Vec<(i32, f64)>,
}

pub struct Record {
    record_id: i32,
    user_con_id: i32,
    price: f64,
    products: Vec<i32>,
    sale_time: i32,
}

pub struct Expense {
    expense_id: i32,
    user_con_id: i32,
    price: f64,
    category: String,
    description: String,
    spend_time: i32,
}
