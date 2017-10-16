//! Type definitions for all tables in the database
#![allow(dead_code)]

use std::panic::catch_unwind;
use postgres::rows::Row;
use postgres_array::Array;
use chrono::{NaiveDateTime, NaiveDate};
use iterator::*;

#[derive(Clone)]
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

#[derive(Clone)]
pub struct Convention {
    pub con_id: i32,
    pub code: String,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}
impl Convention {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                con_id: row.get(0),
                code: row.get(1),
                title: row.get(2),
                start_date: row.get(3),
                end_date: row.get(4),
            }
        }).map_err(|_| "Tried to create a Convention from a non-Convention row".to_string())
    }
}

#[derive(Clone)]
pub struct FullUserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
    pub code: String,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}

#[derive(Clone, Copy)]
pub struct UserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
}
impl UserConvention {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                user_con_id: row.get(0),
                user_id: row.get(1),
                con_id: row.get(2),
            }
        }).map_err(|_| "Tried to create a UserConvention from a non-UserConvention row".to_string())
    }

    pub fn filled_with(self, con: Convention) -> FullUserConvention {
        FullUserConvention {
            user_con_id: self.user_con_id,
            user_id: self.user_id,
            con_id: self.con_id,
            code: con.code,
            title: con.title,
            start_date: con.start_date,
            end_date: con.end_date,
        }
    }
}

#[derive(Clone)]
pub struct ProductInInventory {
    pub product: Product,
    pub inventory: InventoryItem,
}
#[derive(Clone)]
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

    pub fn in_inventory(self, inventory: InventoryItem) -> ProductInInventory {
        ProductInInventory {
            product: self,
            inventory
        }
    }
}

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
                type_id: row.get(0),
                user_id: row.get(1),
                name: row.get(2),
                color: row.get(3),
                discontinued: row.get(4),
            }
        }).map_err(|_| "Tried to create a ProductType from a non-ProductType row".to_string())
    }
}

#[derive(Clone, Copy)]
pub struct InventoryItem {
    pub inv_id: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub product_id: i32,
    pub quantity: i32,
}
impl InventoryItem {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                inv_id: row.get(0),
                user_id: row.get(1),
                user_con_id: row.get(2),
                product_id: row.get(3),
                quantity: row.get(4),
            }
        }).map_err(|_| "Tried to create an InventoryItem from a non-Inventory row".to_string())
    }
}

#[derive(Clone, Copy)]
pub struct PriceRow {
    pub index: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub quantity: i32,
    pub price: f64,
}

#[derive(Clone)]
pub struct Price {
    pub price_id: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub prices: Vec<(i32, f64)>,
}
impl Price {
    pub fn from(row: Row) -> Result<Self, String> {
        let prices: Array<f64> = row.get(5);
        catch_unwind(|| {
            Self {
                price_id: row.get(0),
                user_id: row.get(1),
                user_con_id: row.get(2),
                type_id: row.get(3),
                product_id: row.get(4),
                prices: prices.into_iter().paired().map(|r| (r.0 as i32, r.1)).collect(),
            }
        }).map_err(|_| "Tried to create a Price from a non-Price row".to_string())
    }

    pub fn spread(self, index: i32) -> Vec<PriceRow> {
        self.prices
            .iter()
            .enumerate()
            .map(|(i, &(quantity, price))| PriceRow {
                index: index + i as i32,
                user_id: self.user_id,
                user_con_id: self.user_con_id,
                type_id: self.type_id,
                product_id: self.product_id,
                quantity,
                price,
            } )
            .collect()
    }
}

#[derive(Clone)]
pub struct Record {
    pub record_id: i32,
    pub user_con_id: i32,
    pub price: f64,
    pub products: Vec<i32>,
    pub sale_time: i32,
}

#[derive(Clone)]
pub struct Expense {
    pub expense_id: i32,
    pub user_con_id: i32,
    pub price: f64,
    pub category: String,
    pub description: String,
    pub spend_time: i32,
}
