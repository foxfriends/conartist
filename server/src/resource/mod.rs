//! GraphQL endpoint to retrieve extra resources, such as images
use std::io::Read;
use hyper::client::Client;
use hyper::status::StatusCode;
use juniper::{FieldResult, FieldError, Value};

mod image;

use self::image::Image;

pub struct Query;

const IMAGE_BASE_URL: &'static str = "http://cameldridge.com/conartist/resource/image/";

graphql_object!(Query: Client |&self| {
    description: "Extra resources, such as images"

    field image(
        &executor,
        image_id: String as "The UUID of an image",
        max_height: Option<i32> as "The maximum height of the image. Defaults to no limit",
        max_width: Option<i32> as "The maximum width of the image. Defaults to no limit",
    ) -> FieldResult<Image> {
        let url = format!("{}{}{}", IMAGE_BASE_URL, image_id, ".png");
        executor
            .context()
            .get(&url)
            .send()
            .map_err(|error| {
                FieldError::new(error, Value::String("".to_string()))
            })
            .and_then(|mut res| {
                if res.status == StatusCode::Ok {
                    let mut bytes = vec![];
                    res.read_to_end(&mut bytes);
                    Ok(Image::new(bytes))
                } else {
                    Err(FieldError::new("Could not load image", Value::String("".to_string())))
                }
            })
            .map(|img| img.resized_to_fit(max_width, max_height))
    }
});
