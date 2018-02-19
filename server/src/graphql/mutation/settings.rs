//! Mutations to modify a user's settings
use juniper::FieldResult;
use database::Database;
use money::Currency;

pub struct SettingsMutation(pub Option<i32>);

graphql_object!(SettingsMutation: Database |&self| {
    description: "Mutations to modify a user's settings"

    field currency(&executor, currency: Currency) -> FieldResult<Currency> {
        dbtry! {
            executor
                .context()
                .set_user_settings_currency(self.0, currency)
        }
    }
});
