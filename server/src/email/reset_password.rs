use lettre_email::EmailBuilder;
use lettre::EmailTransport;

use crate::env::{CONARTIST_BASE_URL, CONARTIST_SERVER_EMAIL};
use crate::error::MailerError;
use super::sender::SENDER;

/// Sends the "confirm email" email after a signup
pub fn send(email: String, verification_code: String) -> Result<(), MailerError> {
    let email = EmailBuilder::new()
        .to(email)
        .from(CONARTIST_SERVER_EMAIL.to_string())
        .subject("ConArtist Password Reset")
        .html(format!(include_str!("reset_password.html"), url=CONARTIST_BASE_URL.to_string(), verification_code=verification_code))
        .build()?;
    SENDER.lock().unwrap().send(&email)?;
    Ok(())
}
