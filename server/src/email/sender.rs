use lazy_static::lazy_static;
use lettre::smtp::{
    SmtpClient, SmtpTransport,
    authentication::{Credentials, Mechanism},
    extension::ClientId,
};

use std::sync::Mutex;

use crate::env::{CONARTIST_BASE_URL, MAILGUN_PASSWORD, MAILGUN_USERNAME};

lazy_static! {
    pub static ref SENDER: Mutex<SmtpTransport> = Mutex::new(
        SmtpClient::new_simple("smtp.mailgun.org")
            .unwrap()
            .hello_name(ClientId::Domain(CONARTIST_BASE_URL.to_string()))
            .smtp_utf8(true)
            .authentication_mechanism(Mechanism::Plain)
            .credentials(Credentials::new(
                MAILGUN_USERNAME.to_string(),
                MAILGUN_PASSWORD.to_string()
            ))
            .transport()
    );
}
