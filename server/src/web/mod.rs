//! Serves the user facing web client, providing the static files when request, and the index.html
//! file for any un-found URLs to support the single page application architecture.

use iron::Chain;
use staticfile::Static;
use std::path::Path;

use super::middleware::DefaultTo;
use crate::env::{INDEX_FILE, WEB_ROOT};

pub fn new() -> Chain {
    chain![
        #[ DefaultTo::new(INDEX_FILE.to_string()) ]
        Static::new(Path::new(&WEB_ROOT.to_string()))
    ]
}
