//! GraphQL endpoint to retrieve extra resources, such as images
use hyper::client::Client;
use hyper::status::StatusCode;
use juniper::{DefaultScalarValue, FieldError, FieldResult, Value};
use std::io::Read;

mod image;

use self::image::Image;

pub struct Query;

const IMAGE_BASE_URL: &'static str = "http://cameldridge.com/conartist/resource/image/";

#[graphql_object]
#[graphql(desc = "Extra resources, such as images")]
impl Query {
    fn image(
        context: &Client,
        #[graphql(desc = "The UUID of an image")] image_id: String,
        #[graphql(desc = "The maximum height of the image. Defaults to no limit")]
        max_height: Option<i32>,
        #[graphql(desc = "The maximum width of the image. Defaults to no limit")] max_width: Option<
            i32,
        >,
    ) -> FieldResult<Image> {
        let url = format!("{}{}{}", IMAGE_BASE_URL, image_id, ".png");
        context
            .get(&url)
            .send()
            .map_err(|error| {
                FieldError::new(
                    error,
                    Value::Scalar(DefaultScalarValue::String("".to_string())),
                )
            })
            .and_then(|mut res| {
                if res.status == StatusCode::Ok {
                    let mut bytes = vec![];
                    res.read_to_end(&mut bytes)?;
                    Ok(Image::new(bytes))
                } else {
                    Err(FieldError::new(
                        "Could not load image",
                        Value::Scalar(DefaultScalarValue::String("".to_string())),
                    ))
                }
            })
            .map(|img| img.resized_to_fit(max_width, max_height))
    }
}
