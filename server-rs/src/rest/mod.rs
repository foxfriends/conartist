//! Exposes the v1 (REST) API.

use iron::prelude::*;
use iron::{Handler,status};

pub struct Rest;
impl Handler for Rest {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        Ok(
            Response::with((status::Ok, "Hello world"))
        )
    }
}

pub fn new() -> Rest { Rest }
