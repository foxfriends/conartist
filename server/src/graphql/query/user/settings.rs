//! Holds information about a user's settings
use money::Currency;
use database::Database;
use database::models::*;

graphql_object!(Settings: Database |&self| {
    description: "Holds information about a user's settings"

    field user_id() -> i32 { self.user_id }
    field currency() -> Currency { self.currency }
});
