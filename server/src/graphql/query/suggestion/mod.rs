//! Holds information about a suggestion
use chrono::{DateTime, Utc};
use juniper::FieldResult;

mod connection;

use database::models::*;
use database::Database;

graphql_object!(ScoredSuggestion: Database as "Suggestion" |&self| {
    description: "Holds information about a suggestion made by a user to improve the app"

    field id() -> i32 { self.suggestion_id }
    field suggestion() -> &String { &self.suggestion }
    field suggested_at() -> DateTime<Utc> { DateTime::from_utc(self.create_date, Utc) }
    field status() -> i32 { self.status as i32 }
    field ranking() -> i32 { self.ranking as i32 }

    field voted(&executor) -> bool { // this one might be kind of slow
        executor.context().check_suggestion_voted(self.suggestion_id)
    }

    field suggester(&executor) -> FieldResult<User> {
        dbtry! {
            executor
                .context()
                .get_user_by_id(Some(self.user_id))
        }
    }
});
