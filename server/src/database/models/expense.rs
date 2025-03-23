//! The Expenses table
use diesel::{AsChangeset, Queryable};
use uuid::Uuid;

use super::time::Time;
use crate::database::schema::*;
use crate::money::Money;

#[derive(Queryable, Clone, Debug)]
pub struct Expense {
    pub expense_id: i32,
    pub user_id: i32,
    pub con_id: i32,
    pub price: Money,
    pub category: String,
    pub description: String,
    pub spend_time: Time,
    pub gen_id: Option<Uuid>,
}

#[derive(AsChangeset, Debug)]
#[diesel(table_name = expenses)]
pub struct ExpenseChanges {
    pub category: Option<String>,
    pub description: Option<String>,
    pub price: Option<String>,
}

impl ExpenseChanges {
    pub fn new(
        category: Option<String>,
        description: Option<String>,
        price: Option<Money>,
    ) -> Self {
        Self {
            category,
            description,
            price: price.map(|m| m.to_string()),
        }
    }
}
