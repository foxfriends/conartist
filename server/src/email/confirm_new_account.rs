use lettre_email::EmailBuilder;
use lettre::{EmailTransport, SendmailTransport};

use crate::env::{CONARTIST_BASE_URL, CONARTIST_SERVER_EMAIL};
use crate::error::MailerError;

/// Sends the "confirm email" email
pub fn send(email: String, verification_code: String) -> Result<(), MailerError> {
    let email = EmailBuilder::new()
        .to(email)
        .from(CONARTIST_SERVER_EMAIL.to_string())
        .subject("Your new ConArtist account")
        .html(format!(r#"
<html>
<head></head>
<body>
    <img src="http://localhost:8080/static/images/71e496bf7c8e8469946fd84f0c666776.png" alt="ConArtist Logo" />
    <h1>Welcome to ConArtist</h1>
    <p>
        You are receiving this email because you just signed up for an account with ConArtist. You
        need to verify your email within 3 days or your new account will be locked. Click the link
        below to do verify:
    </p>
    <p>
        <a href="{url}/verify/{verification_code}">{url}/verify/{verification_code}</a>
    </p>
    <p>
        If you didn't sign up for ConArtist, just ignore this email.
    </p>
</body>
</html>
"#, url=CONARTIST_BASE_URL.to_string(), verification_code=verification_code))
        .build()?;
    let mut sender = SendmailTransport::new();
    sender.send(&email)?;
    Ok(())
}
