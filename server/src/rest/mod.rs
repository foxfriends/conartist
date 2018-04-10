//! Exposes the v1 (REST) API.

pub mod auth;
pub mod account;
pub mod authtoken;

use mount::Mount;
use database::Database;

pub fn new(db: Database) -> Mount {
    let mut mount = Mount::new();
    mount
        .mount("/auth", auth::new(db.clone()))
        .mount("/account", account::new(db));
    mount
}
