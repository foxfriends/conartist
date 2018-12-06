//! Simple error type
use std::error::Error;
use std::fmt::{Display, Debug, Formatter, Result};

#[derive(Debug)]
pub struct StringError(pub String);

impl Display for StringError {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        Debug::fmt(self, f)
    }
}

impl Error for StringError {
    fn description(&self) -> &str { &*self.0 }
}

#[derive(Debug)]
pub struct MoneyError(pub String);

impl Display for MoneyError {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        Debug::fmt(self, f)
    }
}

impl Error for MoneyError {
    fn description(&self) -> &str { &*self.0 }
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
    }

    impl Display for MailerError {
        fn fmt(&self, f: &mut Formatter) -> Result {
            Debug::fmt(self, f)
        }
    }

    impl Error for MailerError {
        fn description(&self) -> &str {
            match self {
                MailerError::Building(error) => error.description(),
                MailerError::Sending(error) => error.description(),
            }
        }
    }

    impl From<lettre_email::error::Error> for MailerError {
        fn from(error: lettre_email::error::Error) -> Self {
            MailerError::Building(error)
        }
    }

    impl From<lettre::smtp::error::Error> for MailerError {
        fn from(error: lettre::smtp::error::Error) -> Self {
            MailerError::Sending(error)
        }
    }
}
