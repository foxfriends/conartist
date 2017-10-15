use iron::Request;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub struct DatabaseFactory {
    pool: Pool<PostgresConnectionManager>,
}

impl DatabaseFactory {
    pub fn new(pool: Pool<PostgresConnectionManager>) -> Self {
        Self{ pool }
    }

    pub fn create(&self, request: &Request) -> super::Database {
        super::Database::new(self.pool.clone())
    }
}
