use iron::Request;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;
use rest::auth::Claims;

pub struct DatabaseFactory {
    pool: Pool<PostgresConnectionManager>,
}

impl DatabaseFactory {
    pub fn new(pool: Pool<PostgresConnectionManager>) -> Self {
        Self{ pool }
    }

    pub fn create(&self, request: &Request) -> super::Database {
        let id = request.extensions.get::<Claims>().map(|c| c.usr).unwrap_or(0);
        super::Database::new(self.pool.clone(), id)
    }

    pub fn create_privileged(&self) -> super::Database {
        super::Database::privileged(self.pool.clone())
    }
}
