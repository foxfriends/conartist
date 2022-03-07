//! Exposes the v1 (REST) API.

pub mod account;
pub mod auth;
pub mod authtoken;

use crate::database::Database;
use mount::Mount;

pub fn new(db: Database) -> Mount {
    let mut mount = Mount::new();
    mount
        .mount("/auth", auth::new(db.clone()))
        .mount("/account", account::new(db));
    mount
}
