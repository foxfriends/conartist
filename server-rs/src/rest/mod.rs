//! Exposes the v1 (REST) API.

pub mod auth;

use database::Database;
use mount::Mount;

pub fn new(db: Database) -> Mount {
    let mut mount = Mount::new();
    mount.mount("/auth", auth::new(db));
    mount
}
