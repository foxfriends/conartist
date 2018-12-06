//! Input objects needed to modify sales records
use juniper::GraphQLInputObject;
use chrono::{DateTime,FixedOffset};
use uuid::Uuid;

use crate::money::Money;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a sales record")]
pub struct RecordAdd {
    pub con_id: i32,
    pub uuid: Uuid,
    pub products: Vec<i32>,
    pub price: Money,
    pub time: DateTime<FixedOffset>,
    pub info: String,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify a sales record")]
pub struct RecordMod {
    pub record_id: i32,
    pub products: Option<Vec<i32>>,
    pub price: Option<Money>,
    pub info: Option<String>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to delete a sales record")]
pub struct RecordDel {
    pub record_id: Option<i32>,
    pub uuid: Option<Uuid>,
}
