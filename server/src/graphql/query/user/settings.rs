//! Holds information about a user's settings
use crate::database::models::*;
use crate::database::Database;
use crate::money::Currency;
use juniper::graphql_object;

graphql_object!(Settings: Database |&self| {
    description: "Holds information about a user's settings"

    field user_id() -> i32 { self.user_id }
    field currency() -> Currency { self.currency }
    field language() -> &String { &self.language }
});
