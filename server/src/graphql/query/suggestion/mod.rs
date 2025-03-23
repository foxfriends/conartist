//! Holds information about a suggestion
use chrono::{DateTime, Utc};
use juniper::{FieldResult, graphql_object};

mod connection;

use crate::database::Database;
use crate::database::models::*;

#[graphql_object]
#[graphql(
    name = "Suggestion",
    description = "Holds information about a suggestion made by a user to improve the app"
)]
impl ScoredSuggestion {
    fn id(&self) -> i32 {
        self.suggestion_id
    }
    fn suggestion(&self) -> &String {
        &self.suggestion
    }
    fn suggested_at(&self) -> DateTime<Utc> {
        DateTime::from_utc(self.create_date, Utc)
    }
    fn status(&self) -> i32 {
        self.status as i32
    }
    fn ranking(&self) -> i32 {
        self.ranking as i32
    }

    fn voted(&self, context: &Database) -> bool {
        // this one might be kind of slow
        context.check_suggestion_voted(self.suggestion_id)
    }

    fn suggester(&self, context: &Database) -> FieldResult<User> {
        dbtry! {
            context
                .get_user_by_id(Some(self.user_id))
        }
    }
}
