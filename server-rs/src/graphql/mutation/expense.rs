//! Input objects needed to modify convention expense
use chrono::NaiveDateTime;

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to create a convention expense")]
pub struct ExpenseAdd {
    con_id: i32,
    price: f64,
    category: String,
    description: String,
    time: NaiveDateTime,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to modify a convention expense")]
pub struct ExpenseMod {
    expense_id: i32,
    price: Option<f64>,
    category: Option<String>,
    description: Option<String>,
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description="Information required to delete a convention expense")]
pub struct ExpenseDel {
    expense_id: i32,
}
