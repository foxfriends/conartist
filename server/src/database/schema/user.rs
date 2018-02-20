//! The Users table
use std::panic::catch_unwind;
use postgres::rows::Row;
use chrono::NaiveDateTime;

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
