//! The Records table
use diesel::{AsChangeset, Queryable};
use uuid::Uuid;

use super::time::Time;
use crate::database::schema::*;
use crate::money::Money;

#[derive(Queryable, Clone, Debug)]
pub struct Record {
    pub record_id: i32,
    pub user_id: i32,
    pub con_id: Option<i32>,
    pub price: Money,
    pub info: String,
    pub sale_time: Time,
    pub gen_id: Option<Uuid>,
    pub products: Vec<i32>,
}

#[derive(AsChangeset, Debug)]
#[diesel(table_name = records)]
pub struct RecordChanges {
    pub price: Option<String>,
    pub info: Option<String>,
}

impl RecordChanges {
    pub fn new(price: Option<Money>, info: Option<String>) -> Self {
        Self {
            price: price.map(|m| m.to_string()),
            info,
        }
    }
}
