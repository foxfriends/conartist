//! The Image type for the GraphQL API
use juniper::{Value, graphql_scalar, ParseScalarValue, ParseScalarResult};
use base64;

pub struct Image(Vec<u8>);

impl Image {
    pub fn new(data: Vec<u8>) -> Self {
        Image(data)
    }

    pub fn resized_to_fit(self, _max_width: Option<i32>, _max_height: Option<i32>) -> Self {
        // TODO: implement this!
        self
    }

    pub fn to_base64_png(&self) -> String {
        return base64::encode(&self.0)
    }
}

graphql_scalar!(Image where Scalar = <S> {
    description: "An image encoded as a PNG in base64 representation"

    resolve(&self) -> Value {
        Value::scalar(self.to_base64_png())
    }

    from_input_value(v: &InputValue) -> Option<Image> {
        v   .as_scalar_value::<'_, String>()
            .and_then(|s| base64::decode(&s).ok())
            .map(|b| Image::new(b))
    }

    from_str<'a>(value: ScalarToken<'a>) -> ParseScalarResult<'a, S> {
        <String as ParseScalarValue<S>>::from_str(value)
    }
});
