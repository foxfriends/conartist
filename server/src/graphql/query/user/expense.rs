//! Holds information about a convention expense
use juniper::graphql_object;
use uuid::Uuid;

use crate::database::models::*;
use crate::graphql::DateTimeFixedOffset;
use crate::money::Money;

#[graphql_object]
#[graphql(desc = "Holds information about a convention expense")]
impl Expense {
    fn id(&self) -> i32 {
        self.expense_id
    }

    fn price(&self) -> Money {
        self.price
    }

    fn category(&self) -> &String {
        &self.category
    }

    fn description(&self) -> &String {
        &self.description
    }

    fn time(&self) -> DateTimeFixedOffset {
        DateTimeFixedOffset(self.spend_time.0)
    }

    fn uuid(&self) -> Option<Uuid> {
        self.gen_id
    }
}
