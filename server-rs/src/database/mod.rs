//! Abstraction layer around database access.

mod schema;
pub mod get;

use iron::Request;
use juniper::Context;

pub use self::schema::*;

pub struct Database;

impl Database {
    pub fn new(_: &mut Request) -> Self { Self{} }
}

impl Context for Database {}
