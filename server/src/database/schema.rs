//! Type definitions for all tables in the database
#![allow(dead_code)]

use std::panic::catch_unwind;
use std::str::FromStr;
use postgres::rows::Row;
use chrono::{NaiveDate, NaiveDateTime};
use money::Money;
use serde_json;

#[derive(Clone)]
pub struct User {
    pub user_id: i32,
    pub email: String,
    pub name: String,
    pub password: String,
    pub keys: i32,
    pub join_date: NaiveDateTime,
}
impl User {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                user_id: row.get("user_id"),
                email: row.get("email"),
                name: row.get("name"),
                password: row.get("password"),
                keys: row.get("keys"),
                join_date: row.get("join_date"),
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
                con_id: row.get("con_id"),
                code: row.get("code"),
                title: row.get("title"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
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
impl FullUserConvention {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            FullUserConvention {
                user_con_id: row.get("user_con_id"),
                user_id: row.get("user_id"),
                con_id: row.get("con_id"),
                code: row.get("code"),
                title: row.get("title"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
            }
        }).map_err(|_| "Tried to create a FullUserConvention from a non-FullUserConvention row".to_string())

    }
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
                user_con_id: row.get("user_con_id"),
                user_id: row.get("user_id"),
                con_id: row.get("con_id"),
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
impl ProductInInventory {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                product: Product {
                    product_id: row.get("product_id"),
                    type_id: row.get("type_id"),
                    user_id: row.get("user_id"),
                    name: row.get("name"),
                    discontinued: row.get("discontinued"),
                },
                inventory: InventoryItem {
                    inv_id: row.get("inv_id"),
                    user_id: row.get("user_id"),
                    user_con_id: row.get("user_con_id"),
                    product_id: row.get("product_id"),
                    quantity: row.get("quantity"),
                }
            }
        }).map_err(|_| "Tried to create a ProductInInventory from a non-ProductInInventory row".to_string())
    }
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
                product_id: row.get("product_id"),
                type_id: row.get("type_id"),
                user_id: row.get("user_id"),
                name: row.get("name"),
                discontinued: row.get("discontinued"),
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
                type_id: row.get("type_id"),
                user_id: row.get("user_id"),
                name: row.get("name"),
                color: row.get("color"),
                discontinued: row.get("discontinued"),
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
                inv_id: row.get("inv_id"),
                user_id: row.get("user_id"),
                user_con_id: row.get("user_con_id"),
                product_id: row.get("product_id"),
                quantity: row.get("quantity"),
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
    pub price: Money,
}

#[derive(Clone)]
pub struct Price {
    pub price_id: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub prices: Vec<(i32, Money)>,
}
impl Price {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                price_id: row.get("price_id"),
                user_id: row.get("user_id"),
                user_con_id: row.get("user_con_id"),
                type_id: row.get("type_id"),
                product_id: row.get("product_id"),
                prices: row .get::<&'static str, serde_json::Value>("prices")
                            .as_array()
                            .map(|l|
                                l.clone().iter()
                                    .map(|vp|
                                        vp.as_array()
                                            .map(|p| (p[0].as_i64().unwrap() as i32, FromStr::from_str(p[1].as_str().unwrap()).unwrap()))
                                            .unwrap())
                                    .collect())
                            .unwrap()
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
    pub price: Money,
    pub products: Vec<i32>,
    pub sale_time: NaiveDateTime,
}
impl Record {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                record_id: row.get("record_id"),
                user_con_id: row.get("user_con_id"),
                price: row.get("price"),
                products: row.get("products"),
                sale_time: row.get("sale_time"),
            }
        }).map_err(|_| "Tried to create a Record from a non-Record row".to_string())
    }
}

#[derive(Clone)]
pub struct Expense {
    pub expense_id: i32,
    pub user_con_id: i32,
    pub price: Money,
    pub category: String,
    pub description: String,
    pub spend_time: NaiveDateTime,
}
impl Expense {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                expense_id: row.get("expense_id"),
                user_con_id: row.get("user_con_id"),
                price: row.get("price"),
                category: row.get("category"),
                description: row.get("description"),
                spend_time: row.get("spend_time"),
            }
        }).map_err(|_| "Tried to create an Expense from a non-Expense row".to_string())
    }
}
