//! Middleware to provide a static fallback file to a set of routes.

use iron::prelude::*;
use iron::{AroundMiddleware, Handler, status};
use iron::mime::Mime;
use std::fs::File;

/// Middleware that wraps a handler, returning a static file in the case of a file-not-found error.
pub struct DefaultTo { url: &'static str }
impl DefaultTo {
    /// Creates a new DefaultTo middleware returning the file at the provided url.
    pub fn new(url: &'static str) -> Self { Self { url } }
}
impl AroundMiddleware for DefaultTo {
    fn around(self, handler: Box<dyn Handler>) -> Box<dyn Handler> {
        Box::new(Fallback::new(self.url, handler))
    }
}

/// Handler that wraps another handler, returning a static file in the case of a file-not-found error.
pub struct Fallback<T: Handler> {
    url: &'static str,
    handler: T
}
impl<T: Handler> Fallback<T> {
    /// Creates a new Fallback handler, wrapping the other one with the file at the provided url.
    pub fn new(url: &'static str, handler: T) -> Self { Self { url, handler } }
}
impl<T: Handler> Handler for Fallback<T> {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        match self.handler.handle(req) {
            Err(err) => {
                match err.response.status {
                    Some(status::NotFound) => {
                        let content_type = "text/html".parse::<Mime>().unwrap();
                        Ok(Response::with((content_type, status::Ok, File::open(self.url).unwrap())))
                    }
                    _ => Err(err)
                }
            }
            rest => rest
        }
    }
}
