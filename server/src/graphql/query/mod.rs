//! The entry point of a GraphQL query

mod convention;
mod user;
mod pagination;

use chrono::{DateTime, Utc, FixedOffset};
use juniper::FieldResult;
use database::Database;
use database::models::*;
use self::pagination::Pagination;

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

    field user_convention(
        &executor,
        user_id: Option<i32> as "The ID of the user to retrieve. Leave out to request self",
        con_id: i32 as "The ID of the convention to retrieve",
    ) -> FieldResult<Convention> as "Retrieves the full information of one user's convention" {
        dbtry! {
            executor
                .context()
                .get_convention_for_user(user_id, con_id)
        }
    }

    field convention(
        &executor,
        date: Option<DateTime<FixedOffset>> as "The earliest day for which to retrieve conventions. Defaults to the current time",
        limit = 5: i32 as "The limit on how many conventions to retrieve",
        page = 0: i32 as "Which page to retrieve from",
        exclude_mine = false: bool as "Set to true to not get conventions the current user is already signed up for",
    ) -> Pagination<Convention> as "Retrieves one page of conventions which start after a given date" {
        executor
            .context()
            .get_conventions_after(date.map(|r| r.naive_utc().date()).unwrap_or(Utc::today().naive_utc()), exclude_mine)
            .map(|cons| (
                cons.len(),
                // TODO: do this in SQL
                cons.into_iter()
                    .skip((page * limit) as usize)
                    .take(limit as usize)
                    .collect(),
            ))
            .map(|(total, cons)| Pagination::new(cons, page, total, limit))
            .unwrap_or(Pagination::new(vec![], 0, 0, limit))
    }
});
