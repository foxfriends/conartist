use crate::rest::authtoken::Claims;
use diesel::PgConnection;
use iron::Request;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;

pub struct DatabaseFactory {
    pool: Pool<ConnectionManager<PgConnection>>,
}

impl DatabaseFactory {
    pub fn new(pool: Pool<ConnectionManager<PgConnection>>) -> Self {
        Self { pool }
    }

    pub fn create(&self, request: &Request<'_, '_>) -> super::Database {
        let id = request
            .extensions
            .get::<Claims>()
            .map(|c| c.usr)
            .unwrap_or(0);
        super::Database::new(self.pool.clone(), id)
    }

    pub fn create_privileged(&self) -> super::Database {
        super::Database::privileged(self.pool.clone())
    }
}
