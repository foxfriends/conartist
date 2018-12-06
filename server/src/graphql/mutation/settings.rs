//! Mutations to modify a user's settings
use juniper::FieldResult;
use crate::database::Database;
use crate::money::Currency;

pub struct SettingsMutation(pub Option<i32>);

graphql_object!(SettingsMutation: Database |&self| {
    description: "Mutations to modify a user's settings"

    field language(&executor, language: String) -> FieldResult<String> {
        dbtry! {
            executor
                .context()
                .set_user_settings_language(self.0, language)
        }
    }

    field currency(&executor, currency: Currency) -> FieldResult<Currency> {
        dbtry! {
            executor
                .context()
                .set_user_settings_currency(self.0, currency)
        }
    }
});
