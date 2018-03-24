//! The UserSettings table
use money::Currency;

#[derive(Queryable, Clone)]
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
