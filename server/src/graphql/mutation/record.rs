//! Input objects needed to modify sales records
use chrono::NaiveDateTime;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a sales record")]
pub struct RecordAdd {
    pub con_id: i32,
    pub products: Vec<i32>,
    pub price: f64,
    pub time: NaiveDateTime,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify a sales record")]
pub struct RecordMod {
    pub record_id: i32,
    pub products: Option<Vec<i32>>,
    pub price: Option<f64>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to delete a sales record")]
pub struct RecordDel {
    pub record_id: i32,
}