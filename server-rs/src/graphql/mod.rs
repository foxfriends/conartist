//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod user;

use database::Database;

pub struct Query;

graphql_object!(Query: Database |&self| {
    description: "Entry-point of the GraphQL API"

    field user(&executor, id: Option<i32>, email: Option<String>, username: Option<String>) -> Option<user::User> {
        match (id, email, username) {
            (Some(id), _, _) => Some(user::User::new(id)),
            (_, Some(email), _) => Some(user::User::new(executor.context().get_id_for_email(email))),
            (_, _, Some(username)) => unimplemented!("Users do not have usernames at this time"),
            _ => None
        }
    }
});
