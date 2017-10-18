//! Input objects needed to modify sales records
use chrono::NaiveDateTime;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a sales record")]
pub struct RecordAdd {
    con_id: i32,
    products: Vec<i32>,
    price: f64,
    time: NaiveDateTime,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify a sales record")]
pub struct RecordMod {
    record_id: i32,
    products: Option<Vec<i32>>,
    price: Option<f64>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to delete a sales record")]
pub struct RecordDel {
    record_id: i32,
}
