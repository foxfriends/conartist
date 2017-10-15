//! Abstraction layer around database access.

mod schema;
pub mod get;
pub mod factory;

use juniper::Context;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub use self::schema::*;
pub use self::factory::*;

pub struct Database {
    pool: Pool<PostgresConnectionManager>,
}

impl Database {
    fn new(pool: Pool<PostgresConnectionManager>) -> Self { Self{ pool } }

    pub fn get_id_for_email(&self, email: String) -> i32 { 0 }
}

impl Context for Database {}
