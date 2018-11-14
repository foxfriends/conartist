use lettre_email::EmailBuilder;
use lettre::{EmailTransport, SendmailTransport};

use crate::env::{CONARTIST_BASE_URL, CONARTIST_SERVER_EMAIL};
use crate::error::MailerError;

/// Sends the "confirm email" email
pub fn send(email: String, verification_code: String) -> Result<(), MailerError> {
    let email = EmailBuilder::new()
        .to(email)
        .from(CONARTIST_SERVER_EMAIL.to_string())
        .subject("ConArtist Email Verification")
        .html(format!(r#"
<html>
<head></head>
<body>
    <img src="http://localhost:8080/static/images/71e496bf7c8e8469946fd84f0c666776.png" alt="ConArtist Logo" />
    <h1>Confirm your Email</h1>
    <p>
        Click this link, or paste it into your browser, to confirm your email for ConArtist:
    </p>
    <p>
        <a href="{url}/verify/{verification_code}">{url}/verify/{verification_code}</a>
    </p>
    <p>
        If you didn't change your email, ignore this message and your email will not be changed.
    </p>
</body>
</html>
"#, url=CONARTIST_BASE_URL.to_string(), verification_code=verification_code))
        .build()?;
    let mut sender = SendmailTransport::new();
    sender.send(&email)?;
    Ok(())
}
