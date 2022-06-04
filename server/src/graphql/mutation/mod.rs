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

use crate::database::{models::*, Database};
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

graphql_object!(Mutation: Database |&self| {
    description: "Entry-point for ConArtist GraphQL mutations"

    // Users
    field change_user_email(&executor, user_id: Option<i32>, email: String) -> FieldResult<User> {
        ensure!(email.len() > 0 && email.len() <= 512);

        let EmailVerification { verification_code, email, .. } = dbtry! {
            executor
                .context()
                .change_email(user_id, email)
        }?;

        #[cfg(feature="mailer")]
        confirm_email::send(email, verification_code)?;
        #[cfg(not(feature="mailer"))]
        let User { .. } = dbtry! {
            executor
                .context()
                .verify_email(&verification_code)
        }?;

        dbtry! {
            executor
                .context()
                .get_user_by_id(user_id)
        }
    }

    field change_user_name(&executor, user_id: Option<i32>, name: String) -> FieldResult<User> {
        ensure!(name.len() > 0 && name.len() <= 512);

        dbtry! {
            executor
                .context()
                .set_user_name(user_id, name)
        }
    }

    field add_user_keys(&executor, user_id: Option<i32>, quantity: i32) -> FieldResult<User> {
        ensure!(quantity > 0);

        dbtry! {
            executor
                .context()
                .add_user_keys(user_id, quantity)
        }
    }

    // Product types
    field add_user_product_type(&executor, user_id: Option<i32>, product_type: ProductTypeAdd) -> FieldResult<ProductTypeSnapshot> {
        ensure!(product_type.name.len() > 0 && product_type.name.len() <= 512);
        ensure!(product_type.color >= 0);
        ensure!(product_type.sort >= 0);

        dbtry! {
            executor
                .context()
                .create_product_type(user_id, product_type.name, product_type.color, product_type.sort)
        }
    }

    field mod_user_product_type(&executor, user_id: Option<i32>, product_type: ProductTypeMod) -> FieldResult<ProductTypeSnapshot> {
        ensure!(product_type.type_id > 0);
        let name_length = product_type.name.as_ref().map(|s| s.len()).unwrap_or(1);
        ensure!(name_length > 0 && name_length <= 512);
        ensure!(product_type.color.unwrap_or(0) >= 0);
        ensure!(product_type.sort.unwrap_or(0) >= 0);

        dbtry! {
            executor
                .context()
                .update_product_type(user_id, product_type.type_id, product_type.name, product_type.color, product_type.discontinued, product_type.sort)
        }
    }

    field del_user_product_type(&executor, user_id: Option<i32>, type_id: i32) -> FieldResult<bool> {
        ensure!(type_id > 0);

        dbtry! {
            executor
                .context()
                .delete_product_type(user_id, type_id)
        }
    }

    // Products
    field add_user_product(&executor, user_id: Option<i32>, product: ProductAdd) -> FieldResult<ProductSnapshot> {
        ensure!(product.name.len() > 0 && product.name.len() <= 512);
        ensure!(product.type_id > 0);
        ensure!(product.quantity >= 0);
        ensure!(product.sort >= 0);
        let sku = product.sku.filter(|sku| sku != "");
        dbtry! {
            executor
                .context()
                .create_product(user_id, product.type_id, product.name, sku, product.quantity, product.sort)
        }
    }

    field mod_user_product(&executor, user_id: Option<i32>, product: ProductMod) -> FieldResult<ProductSnapshot> {
        ensure!(product.product_id > 0);
        let name_length = product.name.as_ref().map(|s| s.len()).unwrap_or(1);
        ensure!(name_length > 0 && name_length <= 512);
        ensure!(product.quantity.unwrap_or(0) >= 0);
        ensure!(product.sort.unwrap_or(0) >= 0);

        dbtry! {
            executor
                .context()
                .update_product(user_id, product.product_id, product.name, product.sku, product.quantity, product.discontinued, product.sort)
        }
    }

    field del_user_product(&executor, user_id: Option<i32>, product_id: i32) -> FieldResult<bool> {
        ensure!(product_id > 0);

        dbtry! {
            executor
                .context()
                .delete_product(user_id, product_id)
        }
    }

    // Prices
    field add_user_price(&executor, user_id: Option<i32>, price: PriceAdd) -> FieldResult<Price> {
        ensure!(price.price > Money::new(0i64, price.price.cur()));
        ensure!(price.quantity > 0);
        dbtry! {
            executor
                .context()
                .create_price(user_id, price.type_id, price.product_id, price.quantity, price.price)
        }
    }

    field del_user_price(&executor, user_id: Option<i32>, price: PriceDel) -> FieldResult<bool> {
        dbtry! {
            executor
                .context()
                .delete_price(user_id, price.type_id, price.product_id, price.quantity)
        }
    }

    // Conventions
    field add_user_convention(&executor, user_id: Option<i32>, con_id: i32) -> FieldResult<Convention> {
        dbtry! {
            executor
                .context()
                .create_user_convention(user_id, con_id)
        }
    }

    field del_user_convention(&executor, user_id: Option<i32>, con_id: i32) -> FieldResult<bool> {
         dbtry! {
             executor
                .context()
                .delete_user_convention(user_id, con_id)
         }
    }

    // Records
    field add_user_record(&executor, user_id: Option<i32>, record: RecordAdd) -> FieldResult<Record> {
        ensure!(record.products.len() != 0);
        ensure!(record.con_id.is_none() || record.con_id.unwrap() > 0);
        ensure!(record.price >= Money::new(0i64, record.price.cur()));

        let record = dbtry! {
            executor
                .context()
                .create_user_record(user_id, record.con_id, record.uuid, record.products, record.price, record.time, record.info)
        }?;
        executor.context().trigger_webhook_new_record(&record).ok();
        Ok(record)
    }

    field mod_user_record(&executor, user_id: Option<i32>, record: RecordMod) -> FieldResult<Record> {
        ensure!(record.record_id > 0);
        ensure!(record.products.as_ref().map(|products| products.len() > 0).unwrap_or(true));
        ensure!(record.price.map(|price| price >= Money::new(0i64, price.cur())).unwrap_or(true));
        let old_record = dbtry!(executor.context().get_record_by_id(user_id, Some(record.record_id), None))?;
        let record = dbtry! {
            executor
                .context()
                .update_record(user_id, record.record_id, record.products, record.price, record.info)
        }?;
        executor.context().trigger_webhook_delete_record(&old_record).ok();
        executor.context().trigger_webhook_new_record(&record).ok();
        Ok(record)
    }

    field del_user_record(&executor, user_id: Option<i32>, record: RecordDel) -> FieldResult<bool> {
        // must have one of these two.
        ensure!(record.record_id.is_some() || record.uuid.is_some());
        ensure!(record.record_id.is_none() || record.uuid.is_none());
        let old_record = dbtry!(executor.context().get_record_by_id(user_id, record.record_id, record.uuid))?;
        let ok = dbtry! {
            executor
                .context()
                .delete_record(user_id, record.record_id, record.uuid)
        }?;
        executor.context().trigger_webhook_delete_record(&old_record).ok();
        return Ok(ok)
    }

    // Expenses
    field add_user_expense(&executor, user_id: Option<i32>, expense: ExpenseAdd) -> FieldResult<Expense> {
        ensure!(expense.con_id > 0);
        ensure!(expense.price >= Money::new(0i64, expense.price.cur()));
        ensure!(expense.category.len() > 0 && expense.category.len() < 32);

        dbtry! {
            executor
                .context()
                .create_user_expense(user_id, expense.con_id, expense.uuid, expense.price, expense.category, expense.description, expense.time)
        }
    }

    field mod_user_expense(&executor, user_id: Option<i32>, expense: ExpenseMod) -> FieldResult<Expense> {
        ensure!(expense.expense_id > 0);
        ensure!(expense.category.as_ref().map(|category| category.len() > 0 && category.len() < 32).unwrap_or(true));
        ensure!(expense.price.map(|price| price >= Money::new(0i64, price.cur())).unwrap_or(true));

        dbtry! {
            executor
                .context()
                .update_expense(user_id, expense.expense_id, expense.category, expense.price, expense.description)
        }
    }

    field del_user_expense(&executor, user_id: Option<i32>, expense: ExpenseDel) -> FieldResult<bool> {
        // must have one of these two.
        ensure!(expense.expense_id.is_some() || expense.uuid.is_some());
        ensure!(expense.expense_id.is_none() || expense.uuid.is_none());
        dbtry! {
            executor
                .context()
                .delete_expense(user_id, expense.expense_id, expense.uuid)
        }
    }

    field add_convention_info(&executor, user_id: Option<i32>, con_id: i32, info: String) -> FieldResult<ConventionUserInfo> {
        ensure!(info.len() > 0);
        dbtry! {
            executor
                .context()
                .create_convention_user_info(user_id, con_id, info)
        }
    }

    field upvote_convention_info(&executor, user_id: Option<i32>, info_id: i32) -> FieldResult<ConventionUserInfo> {
        dbtry! {
            executor
                .context()
                .update_convention_user_info_vote(user_id, info_id, true)
        }
    }

    field downvote_convention_info(&executor, user_id: Option<i32>, info_id: i32) -> FieldResult<ConventionUserInfo> {
        dbtry! {
            executor
                .context()
                .update_convention_user_info_vote(user_id, info_id, false)
        }
    }

    field update_settings(&executor, user_id: Option<i32>) -> FieldResult<SettingsMutation> {
        Ok(SettingsMutation(user_id))
    }

    field create_convention(&executor, title: String, start_date: NaiveDate, end_date: NaiveDate) -> FieldResult<Convention> {
        dbtry! {
            executor
                .context()
                .create_convention(None, title, start_date, end_date)
        }
    }

    field add_convention_extra_info(&executor, con_id: i32, title: String, info: Option<String>, action: Option<String>, action_text: Option<String>) -> FieldResult<ConventionExtraInfo> {
        let info_json = info.and_then(|info| serde_json::from_str(&info).unwrap_or(None));

        dbtry! {
            executor
                .context()
                .create_convention_extra_info(None, con_id, title, info_json, action, action_text)
        }
    }

    // suggestions
    field create_suggestion(&executor, suggestion: String) -> FieldResult<ScoredSuggestion> {
        ensure!(suggestion.len() > 0 && suggestion.len() < 1024);

        dbtry! {
            executor
                .context()
                .create_suggestion(suggestion)
        }
    }

    field vote_for_suggestion(&executor, suggestion_id: i32) -> FieldResult<ScoredSuggestion> {
        dbtry! {
            executor
                .context()
                .vote_for_suggestion(suggestion_id)
        }
    }

    // webhooks
    field create_webhook_new_record(&executor, user_id: Option<i32>, webhook: CreateWebhook) -> FieldResult<WebhookNewRecord> {
        dbtry! {
            executor
                .context()
                .create_webhook_new_record(user_id, webhook.url)
        }
    }

    field delete_webhook_new_record(&executor, user_id: Option<i32>, webhook: DeleteWebhook) -> FieldResult<bool> {
        dbtry! {
            executor
                .context()
                .delete_webhook_new_record(user_id, webhook.id)
        }
    }

    field create_webhook_delete_record(&executor, user_id: Option<i32>, webhook: CreateWebhook) -> FieldResult<WebhookDeleteRecord> {
        dbtry! {
            executor
                .context()
                .create_webhook_delete_record(user_id, webhook.url)
        }
    }

    field delete_webhook_delete_record(&executor, user_id: Option<i32>, webhook: DeleteWebhook) -> FieldResult<bool> {
        dbtry! {
            executor
                .context()
                .delete_webhook_delete_record(user_id, webhook.id)
        }
    }
});
