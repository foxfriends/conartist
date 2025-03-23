//! The entry point of a GraphQL query

mod connection;
mod convention;
mod record;
mod suggestion;
mod user;

use self::connection::Connection;
use crate::database::Database;
use crate::database::models::*;
use crate::search::Search;
use chrono::{DateTime, FixedOffset, Utc};
use juniper::{FieldResult, graphql_object};

pub struct Query;
#[graphql_object]
#[graphql(desc = "Entry-point of the ConArtist GraphQL API")]
impl Query {
    #[graphql(desc = "Retrieves one user, corresponding to the provided ID")]
    fn user(
        context: &Database,
        #[graphql(desc = "The ID of the user to retrieve. Leave out to request self")] id: Option<
            i32,
        >,
    ) -> FieldResult<User> {
        dbtry! {
            context
                .get_user_by_id(id)
        }
    }

    #[graphql(desc = "Retrieves the full information of one convention")]
    fn convention(
        context: &Database,
        #[graphql(desc = "The ID of the user to retrieve. Leave out to request self")]
        user_id: Option<i32>,
        #[graphql(desc = "The ID of the convention to retrieve")] con_id: i32,
    ) -> FieldResult<Convention> {
        dbtry! {
            context
                .get_convention(user_id, con_id)
        }
    }

    #[graphql(desc = "Retrieves one page of conventions which start after a given date")]
    fn conventions_connection(
        context: &Database,
        #[graphql(
            desc = "The earliest day for which to retrieve conventions. Defaults to the current time"
        )]
        date: Option<DateTime<FixedOffset>>,
        #[graphql(desc = "An optional search query. Currently unimplemented")] search: Option<
            String,
        >,
        #[graphql(desc = "The limit on how many conventions to retrieve", default = 20)] limit: i32,
        #[graphql(desc = "Cursor to search after")] after: Option<String>,
        #[graphql(desc = "Cursor to search before. Currently unimplemented")] before: Option<
            String,
        >,
    ) -> FieldResult<Connection<Convention>> {
        ensure!(after.is_none() || before.is_none());
        ensure!(search.is_none() || search.as_ref().unwrap().len() < 512);

        let earliest_date = date
            .map(|r| r.naive_utc().date())
            .unwrap_or(Utc::today().naive_utc());

        let query = search.map(Search::parse_query);

        let conventions = dbtry! {
            context
                .get_conventions_after(
                    query.as_ref(),
                    earliest_date,
                    limit as i64,
                    after.as_ref(),
                )
        }?;

        let total = context.count_conventions_after(query.as_ref(), earliest_date);

        Ok(Connection::new(
            conventions,
            after.and_then(|s| s.parse().ok()).unwrap_or(0),
            total,
        ))
    }

    #[graphql(desc = "Retrieves one page of records from sales not at a convention")]
    fn records_connection(
        context: &Database,
        #[graphql(desc = "The limit on how many records to retrieve", default = 100)] limit: i32,
        #[graphql(desc = "Cursor to search after. Currently unimplemented")] after: Option<String>,
        #[graphql(desc = "Cursor to search before")] before: Option<String>,
    ) -> FieldResult<Connection<Record, Option<i32>>> {
        ensure!(after.is_none() || before.is_none());
        let before = before.and_then(|cursor| cursor.parse().ok());

        let records = dbtry! {
            context
                .get_records_for_user(
                    None,
                    limit as i64,
                    before,
                )
        }?;
        let total = context.count_records_for_user(None);

        Ok(Connection::new(records, before, total))
    }

    #[graphql(desc = "Retrieves one page of suggestions")]
    fn suggestions_connection(
        context: &Database,
        #[expect(unused_variables)]
        #[graphql(desc = "An optional search query. Currently unimplemented")]
        search: Option<String>,
        #[graphql(desc = "The limit on how many suggestions to retrieve", default = 20)] limit: i32,
        #[graphql(desc = "Cursor to search after")] after: Option<String>,
        #[graphql(desc = "Cursor to search before. Currently unimplemented")] before: Option<
            String,
        >,
    ) -> FieldResult<Connection<ScoredSuggestion>> {
        ensure!(after.is_none() || before.is_none());

        let suggestions = dbtry! {
            context
                .get_suggestions(
                    None,
                    limit as i64,
                    after.as_ref(),
                )
        }?;
        let total = context.count_suggestions(None);

        Ok(Connection::new(
            suggestions,
            after.and_then(|s| s.parse().ok()).unwrap_or(0),
            total,
        ))
    }
}
