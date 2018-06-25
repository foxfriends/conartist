//! The UserSettings table
use money::Currency;

#[derive(Queryable, Clone, Debug)]
pub struct Settings {
    pub user_id: i32,
    pub currency: Currency,
    pub language: String,
}

impl Settings {
    pub fn default(user_id: i32) -> Settings {
        Settings {
            user_id,
            currency: Currency::CAD,
            language: "en-ca".to_owned(),
        }
    }
}
