//! Input objects needed to modify convention expense
use crate::graphql::DateTimeFixedOffset;
use crate::money::Money;
use juniper::GraphQLInputObject;
use uuid::Uuid;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to create a convention expense")]
pub struct ExpenseAdd {
    pub con_id: i32,
    pub uuid: Uuid,
    pub price: Money,
    pub category: String,
    pub description: String,
    pub time: DateTimeFixedOffset,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to modify a convention expense")]
pub struct ExpenseMod {
    pub expense_id: i32,
    pub price: Option<Money>,
    pub category: Option<String>,
    pub description: Option<String>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to delete a convention expense")]
pub struct ExpenseDel {
    pub expense_id: Option<i32>,
    pub uuid: Option<Uuid>,
}
