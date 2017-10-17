//! Input objects needed to modify sales records
use chrono::NaiveDateTime;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a sales record")]
pub struct RecordAdd {
    products: Vec<i32>,
    price: f64,
    time: NaiveDateTime,
}
