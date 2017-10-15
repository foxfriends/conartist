//! Abstraction layer around database access.

mod schema;
pub mod factory;

use juniper::Context;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub use self::schema::*;
pub use self::factory::*;

#[derive(Clone)]
pub struct Database {
    pool: Pool<PostgresConnectionManager>,
    user_id: Option<i32>,
    privileged: bool,
}

impl Database {
    fn new(pool: Pool<PostgresConnectionManager>, id: i32) -> Self { Self{ pool, user_id: Some(id), privileged: false } }

    fn privileged(pool: Pool<PostgresConnectionManager>) -> Self { Self{ pool, user_id: None, privileged: true } }

    pub fn get_user_for_email(&self, email: &str) -> Option<User> {
        // TODO: make this somehow typesafe/error safe instead of runtime checked?
        //       Maybe Diesel?? Is that too much boilerplate and high DB integration?
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "SELECT * FROM Users WHERE email = $1", email) {
            return User::from(row);
        }
        return None
    }

    pub fn get_user_by_id(&self, user_id: i32) -> Option<User> {
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "SELECT * FROM Users WHERE user_id = $1", user_id) {
            return User::from(row);
        }
        return None
    }
}

impl Context for Database {}
