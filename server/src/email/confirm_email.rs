use lettre_email::Email;
use lettre::Transport;

use crate::env::{CONARTIST_BASE_URL, CONARTIST_SERVER_EMAIL};
use crate::error::MailerError;
use super::sender::SENDER;

/// Sends the "confirm email" email
pub fn send(email: String, verification_code: String) -> Result<(), MailerError> {
    let email = Email::builder()
        .to(email)
        .from((CONARTIST_SERVER_EMAIL.to_string(), "ConArtist"))
        .subject("ConArtist Email Verification")
        .html(format!(include_str!("confirm_email.html"), url=CONARTIST_BASE_URL.to_string(), verification_code=verification_code))
        .build()?;
    SENDER.lock().unwrap().send(email.into())?;
    Ok(())
}
