//! Middleware to provide a static fallback file to a set of routes.

use iron::mime::Mime;
use iron::prelude::*;
use iron::{status, AroundMiddleware, Handler};
use std::fs::File;
use std::path::Path;

/// Middleware that wraps a handler, returning a static file in the case of a file-not-found error.
pub struct DefaultTo<P>
where
    P: 'static + AsRef<Path> + Sync + Send,
{
    url: P,
}

impl<P> DefaultTo<P>
where
    P: 'static + AsRef<Path> + Sync + Send,
{
    /// Creates a new DefaultTo middleware returning the file at the provided url.
    pub fn new(url: P) -> Self {
        Self { url }
    }
}

impl<P> AroundMiddleware for DefaultTo<P>
where
    P: 'static + AsRef<Path> + Sync + Send,
{
    fn around(self, handler: Box<dyn Handler>) -> Box<dyn Handler> {
        Box::new(Fallback::new(self.url, handler))
    }
}

/// Handler that wraps another handler, returning a static file in the case of a file-not-found error.
pub struct Fallback<P, T: Handler>
where
    P: 'static + AsRef<Path> + Sync + Send,
{
    url: P,
    handler: T,
}

impl<P, T: Handler> Fallback<P, T>
where
    P: 'static + AsRef<Path> + Sync + Send,
{
    /// Creates a new Fallback handler, wrapping the other one with the file at the provided url.
    pub fn new(url: P, handler: T) -> Self {
        Self { url, handler }
    }
}

impl<P, T: Handler> Handler for Fallback<P, T>
where
    P: 'static + AsRef<Path> + Sync + Send,
{
    fn handle(&self, req: &mut Request<'_, '_>) -> IronResult<Response> {
        match self.handler.handle(req) {
            Err(err) => match err.response.status {
                Some(status::NotFound) => {
                    let content_type = "text/html".parse::<Mime>().unwrap();
                    Ok(Response::with((
                        content_type,
                        status::Ok,
                        File::open(self.url.as_ref()).unwrap(),
                    )))
                }
                _ => Err(err),
            },
            rest => rest,
        }
    }
}
