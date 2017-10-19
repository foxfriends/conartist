//! Input objects needed to modify convention expense
use chrono::NaiveDateTime;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a convention expense")]
pub struct ExpenseAdd {
    pub con_id: i32,
    pub price: f64,
    pub category: String,
    pub description: String,
    pub time: NaiveDateTime,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify a convention expense")]
pub struct ExpenseMod {
    pub expense_id: i32,
    pub price: Option<f64>,
    pub category: Option<String>,
    pub description: Option<String>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to delete a convention expense")]
pub struct ExpenseDel {
    pub expense_id: i32,
}
