//! Creates JSON encoded ConRequests in an IronResult.

use iron::mime::Mime;
use iron::{IronResult, Response, status};
use log::error;
use serde::Serialize;
use serde_json::json;

/// The success type of ConRequest
pub fn ok<T: Serialize>(v: T) -> IronResult<Response> {
    Ok(Response::with((
        "application/json".parse::<Mime>().unwrap(),
        status::Ok,
        json!({ "status": "Success", "data": v }).to_string(),
    )))
}

/// The failure type of ConRequest
pub fn fail(v: &str) -> IronResult<Response> {
    error!("Error response: {}", v);
    Ok(Response::with((
        "application/json".parse::<Mime>().unwrap(),
        status::Ok,
        json!({ "status": "Failure", "error": v }).to_string(),
    )))
}
