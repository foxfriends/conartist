//! Holds information about a convention expense
use chrono::{DateTime, FixedOffset};
use uuid::Uuid;

use money::Money;
use database::Database;
use database::models::*;

graphql_object!(Expense: Database |&self| {
    description: "Holds information about a convention expense"

    field id() -> i32 { self.expense_id }
    field price() -> Money { self.price }
    field category() -> &String { &self.category }
    field description() -> &String { &self.description }
    field time() -> DateTime<FixedOffset> { self.spend_time.0 }
    field uuid() -> Option<Uuid> { self.gen_id }
});
