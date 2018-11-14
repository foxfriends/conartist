use std::env;
// TODO: get a real secret key
lazy_static! {
    pub static ref JWT_SECRET: String = env::var("JWT_SECRET").unwrap_or(String::from("FAKE_SECRET_KEY"));
    pub static ref CONARTIST_BASE_URL: String = env::var("CONARTIST_BASE_URL").unwrap_or(String::from("localhost:8080"));
    pub static ref CONARTIST_SERVER_EMAIL: String = env::var("CONARTIST_SERVER_EMAIL").unwrap_or(String::from("no-reply@conartist.app"));
    pub static ref DATABASE_URL: String = env::var("DATABASE_URL").unwrap_or(String::from("postgresql://conartist_app:temporary-password@localhost/conartist"));
    pub static ref PORT: String = env::var("PORT").unwrap_or(String::from("8080"));
}
