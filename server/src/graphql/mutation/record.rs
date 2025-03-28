//! Input objects needed to modify sales records
use crate::graphql::DateTimeFixedOffset;
use crate::money::Money;
use juniper::GraphQLInputObject;
use uuid::Uuid;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to create a sales record")]
pub struct RecordAdd {
    pub con_id: Option<i32>,
    pub uuid: Uuid,
    pub products: Vec<i32>,
    pub price: Money,
    pub time: DateTimeFixedOffset,
    pub info: String,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to modify a sales record")]
pub struct RecordMod {
    pub record_id: i32,
    pub products: Option<Vec<i32>>,
    pub price: Option<Money>,
    pub info: Option<String>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to delete a sales record")]
pub struct RecordDel {
    pub record_id: Option<i32>,
    pub uuid: Option<Uuid>,
}
