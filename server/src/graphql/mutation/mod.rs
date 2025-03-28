//! The entry point of a GraphQL mutation
use chrono::NaiveDate;
use juniper::FieldResult;
use serde_json;

mod expense;
mod price;
mod product;
mod product_type;
mod record;
mod settings;
mod webhooks;

use crate::database::{Database, models::*};
#[cfg(feature = "mailer")]
use crate::email::confirm_email;
use crate::money::Money;
use expense::*;
use price::*;
use product::*;
use product_type::*;
use record::*;
use settings::SettingsMutation;
use webhooks::*;

pub struct Mutation;

#[graphql_object]
#[graphql(desc = "Entry-point for ConArtist GraphQL mutations")]
impl Mutation {
    // Users
    fn change_user_email(
        context: &Database,
        user_id: Option<i32>,
        email: String,
    ) -> FieldResult<User> {
        ensure!(email.len() > 0 && email.len() <= 512);

        let EmailVerification {
            verification_code,
            email,
            ..
        } = dbtry! {
            context.change_email(user_id, email)
        }?;

        #[cfg(feature = "mailer")]
        confirm_email::send(email, verification_code)?;
        #[cfg(not(feature = "mailer"))]
        let User { .. } = dbtry! {
            context.verify_email(&verification_code)
        }?;

        dbtry! {
            context.get_user_by_id(user_id)
        }
    }

    fn change_user_name(
        context: &Database,
        user_id: Option<i32>,
        name: String,
    ) -> FieldResult<User> {
        ensure!(name.len() > 0 && name.len() <= 512);

        dbtry! {
            context.set_user_name(user_id, name)
        }
    }

    fn add_user_keys(context: &Database, user_id: Option<i32>, quantity: i32) -> FieldResult<User> {
        ensure!(quantity > 0);

        dbtry! {
            context.add_user_keys(user_id, quantity)
        }
    }

    // Product types
    fn add_user_product_type(
        context: &Database,
        user_id: Option<i32>,
        product_type: ProductTypeAdd,
    ) -> FieldResult<ProductTypeSnapshot> {
        ensure!(product_type.name.len() > 0 && product_type.name.len() <= 512);
        ensure!(product_type.color >= 0);
        ensure!(product_type.sort >= 0);

        dbtry! {
            context.create_product_type(user_id, product_type.name, product_type.color, product_type.sort)
        }
    }

    fn mod_user_product_type(
        context: &Database,
        user_id: Option<i32>,
        product_type: ProductTypeMod,
    ) -> FieldResult<ProductTypeSnapshot> {
        ensure!(product_type.type_id > 0);
        let name_length = product_type.name.as_ref().map(|s| s.len()).unwrap_or(1);
        ensure!(name_length > 0 && name_length <= 512);
        ensure!(product_type.color.unwrap_or(0) >= 0);
        ensure!(product_type.sort.unwrap_or(0) >= 0);

        dbtry! {
            context.update_product_type(user_id, product_type.type_id, product_type.name, product_type.color, product_type.discontinued, product_type.sort)
        }
    }

    fn del_user_product_type(
        context: &Database,
        user_id: Option<i32>,
        type_id: i32,
    ) -> FieldResult<bool> {
        ensure!(type_id > 0);

        dbtry! {
            context.delete_product_type(user_id, type_id)
        }
    }

    // Products
    fn add_user_product(
        context: &Database,
        user_id: Option<i32>,
        product: ProductAdd,
    ) -> FieldResult<ProductSnapshot> {
        ensure!(product.name.len() > 0 && product.name.len() <= 512);
        ensure!(product.type_id > 0);
        ensure!(product.quantity >= 0);
        ensure!(product.sort >= 0);
        let sku = product.sku.filter(|sku| sku != "");
        dbtry! {
            context.create_product(user_id, product.type_id, product.name, sku, product.quantity, product.sort)
        }
    }

    fn mod_user_product(
        context: &Database,
        user_id: Option<i32>,
        product: ProductMod,
    ) -> FieldResult<ProductSnapshot> {
        ensure!(product.product_id > 0);
        let name_length = product.name.as_ref().map(|s| s.len()).unwrap_or(1);
        ensure!(name_length > 0 && name_length <= 512);
        ensure!(product.quantity.unwrap_or(0) >= 0);
        ensure!(product.sort.unwrap_or(0) >= 0);

        dbtry! {
            context.update_product(user_id, product.product_id, product.name, product.sku, product.quantity, product.discontinued, product.sort)
        }
    }

    fn del_user_product(
        context: &Database,
        user_id: Option<i32>,
        product_id: i32,
    ) -> FieldResult<bool> {
        ensure!(product_id > 0);

        dbtry! {
            context.delete_product(user_id, product_id)
        }
    }

    // Prices
    fn add_user_price(
        context: &Database,
        user_id: Option<i32>,
        price: PriceAdd,
    ) -> FieldResult<Price> {
        ensure!(price.price > Money::new(0i64, price.price.cur()));
        ensure!(price.quantity > 0);
        dbtry! {
            context.create_price(user_id, price.type_id, price.product_id, price.quantity, price.price)
        }
    }

    fn del_user_price(
        context: &Database,
        user_id: Option<i32>,
        price: PriceDel,
    ) -> FieldResult<bool> {
        dbtry! {
            context.delete_price(user_id, price.type_id, price.product_id, price.quantity)
        }
    }

    // Conventions
    fn add_user_convention(
        context: &Database,
        user_id: Option<i32>,
        con_id: i32,
    ) -> FieldResult<Convention> {
        dbtry! {
            context.create_user_convention(user_id, con_id)
        }
    }

    fn del_user_convention(
        context: &Database,
        user_id: Option<i32>,
        con_id: i32,
    ) -> FieldResult<bool> {
        dbtry! {
            context.delete_user_convention(user_id, con_id)
        }
    }

    // Records
    fn add_user_record(
        context: &Database,
        user_id: Option<i32>,
        record: RecordAdd,
    ) -> FieldResult<Record> {
        ensure!(record.products.len() != 0);
        ensure!(record.con_id.is_none() || record.con_id.unwrap() > 0);
        ensure!(record.price >= Money::new(0i64, record.price.cur()));

        let record = dbtry! {
            context.create_user_record(user_id, record.con_id, record.uuid, record.products, record.price, record.time.0, record.info)
        }?;
        context.trigger_webhook_new_record(&record).ok();
        Ok(record)
    }

    fn mod_user_record(
        context: &Database,
        user_id: Option<i32>,
        record: RecordMod,
    ) -> FieldResult<Record> {
        ensure!(record.record_id > 0);
        ensure!(
            record
                .products
                .as_ref()
                .map(|products| products.len() > 0)
                .unwrap_or(true)
        );
        ensure!(
            record
                .price
                .map(|price| price >= Money::new(0i64, price.cur()))
                .unwrap_or(true)
        );
        let _old_record = dbtry!(context.get_record_by_id(user_id, Some(record.record_id), None))?;
        let record = dbtry! {
            context.update_record(user_id, record.record_id, record.products, record.price, record.info)
        }?;
        context.trigger_webhook_new_record(&record).ok();
        Ok(record)
    }

    fn del_user_record(
        context: &Database,
        user_id: Option<i32>,
        record: RecordDel,
    ) -> FieldResult<bool> {
        // must have one of these two.
        ensure!(record.record_id.is_some() || record.uuid.is_some());
        ensure!(record.record_id.is_none() || record.uuid.is_none());
        let old_record = dbtry!(context.get_record_by_id(user_id, record.record_id, record.uuid))?;
        let ok = dbtry! {
            context.delete_record(user_id, record.record_id, record.uuid)
        }?;
        context.trigger_webhook_delete_record(&old_record).ok();
        return Ok(ok);
    }

    // Expenses
    fn add_user_expense(
        context: &Database,
        user_id: Option<i32>,
        expense: ExpenseAdd,
    ) -> FieldResult<Expense> {
        ensure!(expense.con_id > 0);
        ensure!(expense.price >= Money::new(0i64, expense.price.cur()));
        ensure!(expense.category.len() > 0 && expense.category.len() < 32);

        dbtry! {
            context.create_user_expense(user_id, expense.con_id, expense.uuid, expense.price, expense.category, expense.description, expense.time.0)
        }
    }

    fn mod_user_expense(
        context: &Database,
        user_id: Option<i32>,
        expense: ExpenseMod,
    ) -> FieldResult<Expense> {
        ensure!(expense.expense_id > 0);
        ensure!(
            expense
                .category
                .as_ref()
                .map(|category| category.len() > 0 && category.len() < 32)
                .unwrap_or(true)
        );
        ensure!(
            expense
                .price
                .map(|price| price >= Money::new(0i64, price.cur()))
                .unwrap_or(true)
        );

        dbtry! {
            context.update_expense(user_id, expense.expense_id, expense.category, expense.price, expense.description)
        }
    }

    fn del_user_expense(
        context: &Database,
        user_id: Option<i32>,
        expense: ExpenseDel,
    ) -> FieldResult<bool> {
        // must have one of these two.
        ensure!(expense.expense_id.is_some() || expense.uuid.is_some());
        ensure!(expense.expense_id.is_none() || expense.uuid.is_none());
        dbtry! {
            context.delete_expense(user_id, expense.expense_id, expense.uuid)
        }
    }

    fn add_convention_info(
        context: &Database,
        user_id: Option<i32>,
        con_id: i32,
        info: String,
    ) -> FieldResult<ConventionUserInfo> {
        ensure!(info.len() > 0);
        dbtry! {
            context.create_convention_user_info(user_id, con_id, info)
        }
    }

    fn upvote_convention_info(
        context: &Database,
        user_id: Option<i32>,
        info_id: i32,
    ) -> FieldResult<ConventionUserInfo> {
        dbtry! {
            context.update_convention_user_info_vote(user_id, info_id, true)
        }
    }

    fn downvote_convention_info(
        context: &Database,
        user_id: Option<i32>,
        info_id: i32,
    ) -> FieldResult<ConventionUserInfo> {
        dbtry! {
            context.update_convention_user_info_vote(user_id, info_id, false)
        }
    }

    fn update_settings(user_id: Option<i32>) -> FieldResult<SettingsMutation> {
        Ok(SettingsMutation(user_id))
    }

    fn create_convention(
        context: &Database,
        title: String,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> FieldResult<Convention> {
        dbtry! {
            context.create_convention(None, title, start_date, end_date)
        }
    }

    fn add_convention_extra_info(
        context: &Database,
        con_id: i32,
        title: String,
        info: Option<String>,
        action: Option<String>,
        action_text: Option<String>,
    ) -> FieldResult<ConventionExtraInfo> {
        let info_json = info.and_then(|info| serde_json::from_str(&info).unwrap_or(None));

        dbtry! {
            context.create_convention_extra_info(None, con_id, title, info_json, action, action_text)
        }
    }

    // suggestions
    fn create_suggestion(context: &Database, suggestion: String) -> FieldResult<ScoredSuggestion> {
        ensure!(suggestion.len() > 0 && suggestion.len() < 1024);

        dbtry! {
            context.create_suggestion(suggestion)
        }
    }

    fn vote_for_suggestion(
        context: &Database,
        suggestion_id: i32,
    ) -> FieldResult<ScoredSuggestion> {
        dbtry! {
            context.vote_for_suggestion(suggestion_id)
        }
    }

    // webhooks
    fn create_webhook_new_record(
        context: &Database,
        user_id: Option<i32>,
        webhook: CreateWebhook,
    ) -> FieldResult<WebhookNewRecord> {
        dbtry! {
            context.create_webhook_new_record(user_id, webhook.url)
        }
    }

    fn delete_webhook_new_record(
        context: &Database,
        user_id: Option<i32>,
        webhook: DeleteWebhook,
    ) -> FieldResult<bool> {
        dbtry! {
            context.delete_webhook_new_record(user_id, webhook.id)
        }
    }

    fn create_webhook_delete_record(
        context: &Database,
        user_id: Option<i32>,
        webhook: CreateWebhook,
    ) -> FieldResult<WebhookDeleteRecord> {
        dbtry! {
            context.create_webhook_delete_record(user_id, webhook.url)
        }
    }

    fn delete_webhook_delete_record(
        context: &Database,
        user_id: Option<i32>,
        webhook: DeleteWebhook,
    ) -> FieldResult<bool> {
        dbtry! {
            context.delete_webhook_delete_record(user_id, webhook.id)
        }
    }
}
