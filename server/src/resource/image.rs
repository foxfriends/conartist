//! The Image type for the GraphQL API
use base64;
use juniper::{InputValue, ScalarValue, Value};

#[derive(GraphQLScalar)]
#[graphql(
    description = "An image encoded as a PNG in base64 representation",
    parse_token(String),
    from_input_with = Self::from_graphql_input,
    to_output_with = Self::to_graphql_output,
)]
pub struct Image(Vec<u8>);

impl Image {
    fn from_graphql_input<S: ScalarValue>(v: &InputValue<S>) -> Result<Image, String> {
        v.as_string_value()
            .ok_or_else(|| "Expected `String`".to_owned())
            .and_then(|s| base64::decode(&s).map_err(|err| err.to_string()))
            .map(|b| Image::new(b))
    }

    fn to_graphql_output<S: ScalarValue>(v: &Self) -> Value<S> {
        Value::from(v.to_base64_png())
    }

    pub fn new(data: Vec<u8>) -> Self {
        Image(data)
    }

    pub fn resized_to_fit(self, _max_width: Option<i32>, _max_height: Option<i32>) -> Self {
        // TODO: implement this!
        self
    }

    pub fn to_base64_png(&self) -> String {
        return base64::encode(&self.0);
    }
}
