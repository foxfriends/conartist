//! Holds information about a convention expense
use database::{Database};
use chrono::{DateTime, Utc};
pub use database::Expense;
use money::Money;

graphql_object!(Expense: Database |&self| {
    description: "Holds information about a convention expense"

    field id() -> i32 { self.expense_id }
    field price() -> Money { self.price }
    field category() -> &String { &self.category }
    field description() -> &String { &self.description }
    field time() -> DateTime<Utc> { DateTime::from_utc(self.spend_time, Utc) }
});
