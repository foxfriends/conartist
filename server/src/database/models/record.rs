//! The Records table
use chrono::NaiveDateTime;
use money::Money;

#[derive(Clone)]
pub struct Record {
    pub record_id: i32,
    pub user_id: i32,
    pub con_id: i32,
    pub price: Money,
    pub products: Vec<i32>,
    pub info: String,
    pub sale_time: NaiveDateTime,
}
