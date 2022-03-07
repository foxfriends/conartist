//! The Prices table
use crate::money::Money;
use chrono::NaiveDateTime;
use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct Price {
    pub price_id: i32,
    pub user_id: i32,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub quantity: i32,
    pub price: Option<Money>, // this should never be None in practice: only deleted prices have null price
    pub mod_date: NaiveDateTime,
}
