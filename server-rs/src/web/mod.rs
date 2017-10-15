//! Serves the user facing web client, providing the static files when request, and the index.html
//! file for any un-found URLs to support the single page application architecture.

use iron::Chain;
use std::path::Path;
use staticfile::Static;

use super::middleware::DefaultTo;

pub fn new() -> Chain {
    chain! [
        [ DefaultTo::new("../web/index.html") ]
        Static::new(Path::new("../web/"))
    ]
}
