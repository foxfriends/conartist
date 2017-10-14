//! Exposes the v1 (REST) API.

use iron::prelude::*;
use iron::{Handler,status};

use mount::Mount;

mod auth;

pub fn new() -> Mount {
    let mut mount = Mount::new();
    mount.mount("/auth", auth::new());
    mount
}
