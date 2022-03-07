//! Holds information about a convention expense
use chrono::{DateTime, FixedOffset};
use juniper::graphql_object;
use uuid::Uuid;

use crate::database::models::*;
use crate::database::Database;
use crate::money::Money;

graphql_object!(Expense: Database |&self| {
    description: "Holds information about a convention expense"

    field id() -> i32 { self.expense_id }
    field price() -> Money { self.price }
    field category() -> &String { &self.category }
    field description() -> &String { &self.description }
    field time() -> DateTime<FixedOffset> { self.spend_time.0 }
    field uuid() -> Option<Uuid> { self.gen_id }
});
