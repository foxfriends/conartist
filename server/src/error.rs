//! Simple error type
use std::error::Error;
use std::fmt::{Display, Debug, Formatter, Result};
use failure;

#[derive(Debug)]
pub struct StringError(pub String);

impl Display for StringError {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        Debug::fmt(self, f)
    }
}

impl Error for StringError {
    fn source(&self) -> Option<&(dyn Error + 'static)> { None }
}

#[derive(Debug)]
pub struct MoneyError(pub String);

impl Display for MoneyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        Debug::fmt(self, f)
    }
}

impl Error for MoneyError {
    fn source(&self) -> Option<&(dyn Error + 'static)> { None }
}

#[cfg(feature="mailer")]
pub use self::mail::*;

#[cfg(feature="mailer")]
mod mail {
    use super::*;

    #[derive(Debug)]
    pub enum MailerError {
        Building(lettre_email::error::Error),
        Sending(lettre::smtp::error::Error),
        Failure(failure::Error),
    }

    impl Display for MailerError {
        fn fmt(&self, f: &mut Formatter) -> Result {
            Debug::fmt(self, f)
        }
    }

    impl Error for MailerError {
        fn source(&self) -> Option<&(dyn Error + 'static)> {
            match self {
                MailerError::Sending(error) => Some(error),
                _ => None,
            }
        }
    }

    impl From<lettre_email::error::Error> for MailerError {
        fn from(error: lettre_email::error::Error) -> Self {
            MailerError::Building(error)
        }
    }

    impl From<failure::Error> for MailerError {
        fn from(error: failure::Error) -> Self {
            MailerError::Failure(error)
        }
    }

    impl From<lettre::smtp::error::Error> for MailerError {
        fn from(error: lettre::smtp::error::Error) -> Self {
            MailerError::Sending(error)
        }
    }
}
