//! Abstraction layer around database access.

mod schema;
pub mod factory;
mod creaters;
mod updaters;
mod getters;
mod setters;
mod deleters;
mod conversions;

use juniper::Context;
use chrono::NaiveDate;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub use self::schema::*;
pub use self::factory::*;
pub use self::conversions::*;

#[derive(Clone)]
pub struct Database {
    pool: Pool<PostgresConnectionManager>,
    user_id: Option<i32>,
    privileged: bool,
}

impl Database {
    fn new(pool: Pool<PostgresConnectionManager>, id: i32) -> Self { Self{ pool, user_id: Some(id), privileged: false } }

    fn privileged(pool: Pool<PostgresConnectionManager>) -> Self { Self{ pool, user_id: None, privileged: true } }

    fn resolve_user_id(&self, maybe_user_id: Option<i32>) -> Result<i32, String> {
        let user_id = maybe_user_id.unwrap_or_else(|| self.user_id.expect("Cannot get user id for self when in privileged mode!"));
        assert_authorized!(self, user_id);
        Ok(user_id)
    }
}

impl Context for Database {}
