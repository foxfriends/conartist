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
        .subject("Your new ConArtist account")
        .html(format!(
            include_str!("confirm_new_account.html"),
            url = CONARTIST_BASE_URL.to_string(),
            verification_code = verification_code
        ))
        .build()?;
    SENDER.lock().unwrap().send(email.into())?;
    Ok(())
}
