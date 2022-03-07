//! Holds information about a sale record
use chrono::{DateTime, FixedOffset};
use juniper::graphql_object;
use uuid::Uuid;

use crate::database::models::*;
use crate::database::Database;
use crate::money::Money;

graphql_object!(Record: Database |&self| {
    description: "Holds information about a sale record"

    field id() -> i32 { self.record_id }
    field products() -> &Vec<i32> { &self.products }
    field price() -> Money { self.price }
    field info() -> &String { &self.info }
    field time() -> DateTime<FixedOffset> { self.sale_time.0 }
    field uuid() -> Option<Uuid> { self.gen_id }
});
