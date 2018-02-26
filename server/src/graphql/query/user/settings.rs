//! Holds information about a user's settings
use database::{Database, Settings};
use money::Currency;

graphql_object!(Settings: Database |&self| {
    description: "Holds information about a user's settings"

    field user_id() -> i32 { self.user_id }
    field currency() -> Currency { self.currency }
});
