//! The Users table
use chrono::NaiveDateTime;

#[derive(Queryable, Clone, Debug)]
pub struct User {
    pub user_id: i32,
    pub email: String,
    pub name: String,
    pub password: String,
    pub keys: i32,
    pub join_date: NaiveDateTime,
}
