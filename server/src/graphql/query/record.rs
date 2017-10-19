//! Holds information about a sale record
use database::Database;
use chrono::NaiveDateTime;
use database::Record;

graphql_object!(Record: Database |&self| {
    description: "Holds information about a sale record"

    field products() -> &Vec<i32> { &self.products }
    field price() -> f64 { self.price }
    field time() -> NaiveDateTime { self.sale_time }
});
