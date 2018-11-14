//! Abstraction layer around database access.

pub mod factory;
pub mod models;

mod schema;

// old stuff, to be broken up better later
mod creaters;
mod updaters;
mod getters;
mod setters;
mod deleters;

mod suggestions;
mod account;

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

    /// Resolves the user ID by accepting None as the current user, then ensures that the current user is that ID
    fn resolve_user_id_protected(&self, maybe_user_id: Option<i32>) -> Result<i32, String> {
        let user_id = maybe_user_id.unwrap_or_else(|| self.user_id.expect("Cannot get user id for self when in privileged mode!"));
        assert_authorized!(self, user_id);
        Ok(user_id)
    }

    /// Resolves the user ID by accepting None as the current user.
    fn resolve_user_id(&self, maybe_user_id: Option<i32>) -> i32 {
        maybe_user_id.unwrap_or_else(|| self.user_id.expect("Cannot get user id for self when in privileged mode!"))
    }

    pub fn protect_me(&self, user_id: i32) -> Result<(), String> {
        assert_authorized!(self, user_id);
        Ok(())
    }
}

impl Context for Database {}
