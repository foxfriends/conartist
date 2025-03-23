//! Mutations to modify a user's settings
use juniper::FieldResult;

use crate::database::Database;
use crate::money::Currency;

pub struct SettingsMutation(pub Option<i32>);

#[graphql_object]
#[graphql(desc = "Mutations to modify a user's settings")]
impl SettingsMutation {
    fn language(&self, context: &Database, language: String) -> FieldResult<String> {
        dbtry! {
            context
                .set_user_settings_language(self.0, language)
        }
    }

    fn currency(&self, context: &Database, currency: Currency) -> FieldResult<Currency> {
        dbtry! {
            context
                .set_user_settings_currency(self.0, currency)
        }
    }
}
