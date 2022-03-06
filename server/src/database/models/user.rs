//! The Users table
use chrono::NaiveDateTime;
use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct RawUser {
    pub user_id: i32,
    pub email: Option<String>,
    pub name: String,
    pub password: String,
    pub keys: i32,
    pub join_date: NaiveDateTime,
}

impl RawUser {
    pub fn unwrap(self) -> User {
        User {
            user_id: self.user_id,
            email: self.email.unwrap(),
            password: self.password,
            keys: self.keys,
            join_date: self.join_date,
            name: self.name,
        }
    }

    pub fn with_email(self, email: String) -> User {
        User {
            user_id: self.user_id,
            email: self.email.unwrap_or(email),
            password: self.password,
            keys: self.keys,
            join_date: self.join_date,
            name: self.name,
        }
    }
}

#[derive(Queryable, Clone, Debug)]
pub struct User {
    pub user_id: i32,
    pub email: String,
    pub password: String,
    pub keys: i32,
    pub join_date: NaiveDateTime,
    pub name: String,
}
