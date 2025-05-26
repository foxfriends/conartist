//! Holds information about a user and their products, prices, and conventions
use chrono::{DateTime, Utc};
use juniper::{FieldResult, graphql_object};

use crate::database::Database;
use crate::database::models::*;

mod expense;
mod price;
mod product;
mod product_type;
mod settings;
mod webhooks;

use webhooks::Webhooks;

#[graphql_object]
#[graphql(
    description = "Holds information about a user and their products, prices, and conventions"
)]
impl User {
    fn id(&self) -> i32 {
        self.user_id
    }
    fn name(&self) -> &String {
        &self.name
    }
    fn verified(&self, context: &Database) -> FieldResult<bool> {
        dbtry! {
            context
                .is_email_verified(self.user_id)
        }
    }

    fn email(&self, context: &Database) -> FieldResult<&String> {
        context.protect_me(self.user_id)?;
        Ok(&self.email)
    }

    fn keys(&self, context: &Database) -> FieldResult<i32> {
        context.protect_me(self.user_id)?;
        Ok(self.keys)
    }

    fn join_date(&self) -> DateTime<Utc> {
        DateTime::from_naive_utc_and_offset(self.join_date, Utc)
    }

    fn product_types(
        &self,
        context: &Database,
        as_of: Option<DateTime<Utc>>,
    ) -> FieldResult<Vec<ProductTypeSnapshot>> {
        dbtry! {
            context
                .get_product_types_for_user(Some(self.user_id), as_of)
        }
    }

    fn products(
        &self,
        context: &Database,
        as_of: Option<DateTime<Utc>>,
    ) -> FieldResult<Vec<ProductSnapshot>> {
        dbtry! {
            context
                .get_products_for_user(Some(self.user_id), as_of)
        }
    }

    fn prices(&self, context: &Database) -> FieldResult<Vec<Price>> {
        dbtry! {
            context
                .get_prices_for_user(Some(self.user_id))
        }
    }

    fn conventions(&self, context: &Database) -> FieldResult<Vec<Convention>> {
        dbtry! {
            context
                .get_conventions_for_user(Some(self.user_id))
        }
    }

    fn settings(&self, context: &Database) -> Settings {
        context
            .get_settings_for_user(Some(self.user_id))
            .unwrap_or(Settings::default(self.user_id))
    }

    fn webhooks(&self) -> Webhooks {
        Webhooks {
            user_id: self.user_id,
        }
    }

    fn clearance(&self, context: &Database) -> i32 {
        context.get_admin_clearance(Some(self.user_id)).unwrap_or(0)
    }
}
