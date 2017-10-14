use serde::{Serialize, Deserialize};
use iron::{Response, status, IronResult};
use iron::mime::Mime;

pub fn ok<T: Serialize>(v: T) -> IronResult<Response> {
    Ok(Response::with((
        "application/json".parse::<Mime>().unwrap(),
        status::Ok,
        json!({ "status": "Success", "data": v }).to_string(),
    )))
}

pub fn fail(v: &str) -> IronResult<Response> {
    Ok(Response::with((
        "application/json".parse::<Mime>().unwrap(),
        status::Ok,
        json!({ "status": "Failure", "error": v }).to_string()
    )))
}
