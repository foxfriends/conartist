//! Abstraction layer around database access.

mod schema;
pub mod factory;
mod getters;
mod setters;
mod creaters;

use juniper::Context;
use chrono::NaiveDate;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub use self::schema::*;
pub use self::factory::*;

#[derive(Clone)]
pub struct Database {
    pool: Pool<PostgresConnectionManager>,
    user_id: Option<i32>,
    privileged: bool,
}

impl Database {
    fn new(pool: Pool<PostgresConnectionManager>, id: i32) -> Self { Self{ pool, user_id: Some(id), privileged: false } }

    fn privileged(pool: Pool<PostgresConnectionManager>) -> Self { Self{ pool, user_id: None, privileged: true } }
}

impl Context for Database {}
