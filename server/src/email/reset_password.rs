use lettre::Transport;
use lettre_email::Email;

use super::sender::SENDER;
use crate::env::{CONARTIST_BASE_URL, CONARTIST_SERVER_EMAIL};
use crate::error::MailerError;

/// Sends the "confirm email" email after a signup
pub fn send(email: String, verification_code: String) -> Result<(), MailerError> {
    let email = Email::builder()
        .to(email)
        .from((CONARTIST_SERVER_EMAIL.to_string(), "ConArtist"))
        .subject("ConArtist Password Reset")
        .html(format!(
            include_str!("reset_password.html"),
            url = &*CONARTIST_BASE_URL,
            verification_code = verification_code
        ))
        .build()?;
    SENDER.lock().unwrap().send(email.into())?;
    Ok(())
}
