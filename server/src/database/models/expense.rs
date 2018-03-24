//! The Expenses table
use chrono::NaiveDateTime;
use money::Money;

#[derive(Queryable, Clone)]
pub struct Expense {
    pub expense_id: i32,
    pub user_id: i32,
    pub con_id: i32,
    pub price: Money,
    pub category: String,
    pub description: String,
    pub spend_time: NaiveDateTime,
}
