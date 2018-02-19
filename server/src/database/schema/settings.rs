//! The UserSettings table
use std::panic::catch_unwind;
use postgres::rows::Row;
use money::Currency;

#[derive(Clone)]
pub struct Settings {
    pub user_id: i32,
    pub currency: Currency,
}

impl Settings {
    pub fn default(user_id: i32) -> Settings {
        Settings {
            user_id,
            currency: Currency::CAD,
        }
    }
}

impl Settings {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                user_id: row.get("user_id"),
                currency: row.get("currency"),
            }
        }).map_err(|_| "Tried to create a Settings from a non-UserSettings row".to_string())
    }
}
