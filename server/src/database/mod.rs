//! Abstraction layer around database access.

pub mod factory;
pub mod models;

mod schema;
mod creaters;
mod updaters;
mod getters;
mod setters;
mod deleters;
mod conversions;
mod dsl;
mod views;

use juniper::Context;
use diesel::PgConnection;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;

pub use self::factory::*;
pub use self::conversions::*;

#[derive(Clone)]
pub struct Database {
    pool: Pool<ConnectionManager<PgConnection>>,
    user_id: Option<i32>,
    privileged: bool,
}

impl Database {
    fn new(pool: Pool<ConnectionManager<PgConnection>>, id: i32) -> Self { Self{ pool, user_id: Some(id), privileged: false } }

    fn privileged(pool: Pool<ConnectionManager<PgConnection>>) -> Self { Self{ pool, user_id: None, privileged: true } }

    fn resolve_user_id(&self, maybe_user_id: Option<i32>) -> Result<i32, String> {
        let user_id = maybe_user_id.unwrap_or_else(|| self.user_id.expect("Cannot get user id for self when in privileged mode!"));
        assert_authorized!(self, user_id);
        Ok(user_id)
    }
}

impl Context for Database {}
