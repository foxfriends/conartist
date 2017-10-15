//! Abstraction layer around database access.

mod schema;
pub mod get;
pub mod factory;

use juniper::Context;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub use self::schema::*;
pub use self::factory::*;

pub struct Database {
    pool: Pool<PostgresConnectionManager>,
}

impl Database {
    fn new(pool: Pool<PostgresConnectionManager>) -> Self { Self{ pool } }

    pub fn get_id_for_email(&self, email: String) -> Option<i32> {
        // TODO: make this somehow typesafe/error safe instead of runtime checked?
        //       Maybe Diesel?? Is that too much boilerplate and high DB integration?
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "SELECT user_id FROM Users WHERE email = $1", email) {
            return Some(row.get(0))
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
