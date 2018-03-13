//! The Expenses table
use std::panic::catch_unwind;
use postgres::rows::Row;
use chrono::NaiveDateTime;
use money::Money;

#[derive(Clone)]
pub struct Expense {
    pub expense_id: i32,
    pub user_id: i32,
    pub con_id: i32,
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
                user_id: row.get("user_id"),
                con_id: row.get("con_id"),
                price: row.get("price"),
                category: row.get("category"),
                description: row.get("description"),
                spend_time: row.get("spend_time"),
            }
        }).map_err(|_| "Tried to create an Expense from a non-Expense row".to_string())
    }
}
