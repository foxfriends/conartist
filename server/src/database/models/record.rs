//! The Records table
use chrono::NaiveDateTime;

use database::schema::*;
use money::Money;

#[derive(Queryable, Clone)]
pub struct Record {
    pub record_id: i32,
    pub user_id: i32,
    pub con_id: i32,
    pub price: Money,
    pub products: Vec<i32>,
    pub info: String,
    pub sale_time: NaiveDateTime,
}

#[derive(AsChangeset)]
#[table_name="records"]
pub struct RecordChanges {
    pub products: Option<Vec<i32>>,
    pub price: Option<String>,
    pub info: Option<String>,
}

impl RecordChanges {
    pub fn new(products: Option<Vec<i32>>, price: Option<Money>, info: Option<String>) -> Self {
        Self {
            products,
            price: price.map(|m| m.to_string()),
            info,
        }
    }
}
