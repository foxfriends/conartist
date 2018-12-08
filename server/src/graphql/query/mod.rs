//! The entry point of a GraphQL query

mod connection;
mod convention;
mod user;
mod suggestion;

use chrono::{DateTime, Utc, FixedOffset};
use juniper::{graphql_object, FieldResult};
use crate::database::Database;
use crate::database::models::*;
use self::connection::Connection;

pub struct Query;

graphql_object!(Query: Database |&self| {
    description: "Entry-point of the ConArtist GraphQL API"

    field user(
        &executor,
        id: Option<i32> as "The ID of the user to retrieve. Leave out to request self",
    ) -> FieldResult<User> as "Retrieves one user, corresponding to the provided ID" {
        dbtry! {
            executor
                .context()
                .get_user_by_id(id)
        }
    }

    field convention(
        &executor,
        user_id: Option<i32> as "The ID of the user to retrieve. Leave out to request self",
        con_id: i32 as "The ID of the convention to retrieve",
    ) -> FieldResult<Convention> as "Retrieves the full information of one convention" {
        dbtry! {
            executor
                .context()
                .get_convention(user_id, con_id)
        }
    }

    field conventions_connection(
        &executor,
        date: Option<DateTime<FixedOffset>> as "The earliest day for which to retrieve conventions. Defaults to the current time",
        search: Option<String> as "An optional search query. Currently unimplemented",
        limit = 20: i32 as "The limit on how many conventions to retrieve",
        after: Option<String> as "Cursor to search after",
        before: Option<String> as "Cursor to search before. Currently unimplemented",
    ) -> FieldResult<Connection<Convention>> as "Retrieves one page of conventions which start after a given date" {
        ensure!(after.is_none() || before.is_none());

        let earliest_date = date.map(|r| r.naive_utc().date()).unwrap_or(Utc::today().naive_utc());

        let conventions = dbtry! {
            executor
                .context()
                .get_conventions_after(
                    search.as_ref(),
                    earliest_date,
                    limit as i64,
                    after.as_ref(),
                )
        }?;

        let total = executor
            .context()
            .count_conventions_after(
                search.as_ref(),
                earliest_date,
            );

        Ok(Connection::new(conventions, after.and_then(|s| s.parse().ok()).unwrap_or(0), total))
    }

    field suggestions_connection(
        &executor,
        search: Option<String> as "An optional search query. Currently unimplemented",
        limit = 20: i32 as "The limit on how many suggestions to retrieve",
        after: Option<String> as "Cursor to search after",
        before: Option<String> as "Cursor to search before. Currently unimplemented",
    ) -> FieldResult<Connection<ScoredSuggestion>> as "Retrieves one page of suggestions" {
        ensure!(after.is_none() || before.is_none());

        let suggestions = dbtry! {
            executor
                .context()
                .get_suggestions(
                    None,
                    limit as i64,
                    after.as_ref(),
                )
        }?;
        let total = executor.context().count_suggestions(None);

        Ok(Connection::new(suggestions, after.and_then(|s| s.parse().ok()).unwrap_or(0), total))
    }
});
