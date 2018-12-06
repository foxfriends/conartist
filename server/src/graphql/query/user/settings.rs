//! Holds information about a user's settings
use crate::money::Currency;
use crate::database::Database;
use crate::database::models::*;

graphql_object!(Settings: Database |&self| {
    description: "Holds information about a user's settings"

    field user_id() -> i32 { self.user_id }
    field currency() -> Currency { self.currency }
    field language() -> &String { &self.language }
});
