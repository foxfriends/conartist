use lazy_static::lazy_static;
use std::env;

macro_rules! env_var {
    ($name:ident, $default:expr) => (lazy_static! { pub static ref $name: String = env::var(stringify!($name)).unwrap_or(String::from($default)); });
}

env_var!(JWT_SECRET, "FAKE_SECRET_KEY");
env_var!(CONARTIST_BASE_URL, "localhost:8080");
env_var!(CONARTIST_SERVER_EMAIL, "hello@conartist.app");
env_var!(DATABASE_URL, "postgresql://conartist_app:temporary-password@localhost/conartist");
env_var!(PORT, "8080");
env_var!(MAILGUN_USERNAME, "postmaster@mail.conartist.app");
env_var!(MAILGUN_PASSWORD, "placeholder-password");
env_var!(MAILGUN_API_KEY, "placeholder-api-key");
env_var!(WEB_ROOT, "../web");
env_var!(INDEX_FILE, "../web/index.html");
