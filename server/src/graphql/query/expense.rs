//! Holds information about a convention expense
use database::{Database, Money};
use chrono::NaiveDateTime;
pub use database::Expense;

graphql_object!(Expense: Database |&self| {
    description: "Holds information about a convention expense"

    field id() -> i32 { self.expense_id }
    field price() -> Money { self.price }
    field category() -> &String { &self.category }
    field description() -> &String { &self.description }
    field spend_time() -> NaiveDateTime { self.spend_time }
});
