//! The entry point of a GraphQL mutation

mod product;
mod product_type;
mod price;
mod record;
mod expense;
mod settings;

use juniper::FieldResult;
use serde_json;
use database::{Database, User, ProductType, ProductInInventory, Price, Convention, ConventionUserInfo, Record, Expense};
use money::Money;
use self::product::*;
use self::product_type::*;
use self::price::*;
use self::record::*;
use self::expense::*;
use self::settings::SettingsMutation;

pub struct Mutation;

graphql_object!(Mutation: Database |&self| {
    description: "Entry-point for ConArtist GraphQL mutations"

    // Users
    field change_user_email(&executor, user_id: Option<i32>, email: String) -> FieldResult<User> {
        ensure!(email.len() > 0 && email.len() <= 512);

        dbtry! {
            executor
                .context()
                .set_user_email(user_id, email)
        }
    }

    field change_user_password(&executor, user_id: Option<i32>, orig_password: String, password: String) -> FieldResult<User> {
        ensure!(password.len() > 0);

        dbtry! {
            executor
                .context()
                .set_user_password(user_id, orig_password, password)
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
    field add_user_product_type(&executor, user_id: Option<i32>, product_type: ProductTypeAdd) -> FieldResult<ProductType> {
        ensure!(product_type.name.len() > 0 && product_type.name.len() <= 512);
        ensure!(product_type.color >= 0);

        dbtry! {
            executor
                .context()
                .create_product_type(user_id, product_type.name, product_type.color)
        }
    }

    field mod_user_product_type(&executor, user_id: Option<i32>, product_type: ProductTypeMod) -> FieldResult<ProductType> {
        ensure!(product_type.type_id > 0);
        let name_length = product_type.name.as_ref().map(|s| s.len()).unwrap_or(1);
        ensure!(name_length > 0 && name_length <= 512);
        ensure!(product_type.color.unwrap_or(0) >= 0);

        dbtry! {
            executor
                .context()
                .update_product_type(user_id, product_type.type_id, product_type.name, product_type.color, product_type.discontinued)
        }
    }

    // Products
    field add_user_product(&executor, user_id: Option<i32>, product: ProductAdd) -> FieldResult<ProductInInventory> {
        ensure!(product.name.len() > 0 && product.name.len() <= 512);
        ensure!(product.type_id > 0);
        ensure!(product.quantity >= 0);

        dbtry! {
            executor
                .context()
                .create_product(user_id, product.type_id, product.name, product.quantity)
        }
    }

    field mod_user_product(&executor, user_id: Option<i32>, product: ProductMod) -> FieldResult<ProductInInventory> {
        ensure!(product.product_id > 0);
        let name_length = product.name.as_ref().map(|s| s.len()).unwrap_or(1);
        ensure!(name_length > 0 && name_length <= 512);
        ensure!(product.quantity.unwrap_or(0) >= 0);

        dbtry! {
            executor
                .context()
                .update_product(user_id, product.product_id, product.name, product.quantity, product.discontinued)
        }
    }

    // Prices
    field add_user_price(&executor, user_id: Option<i32>, price: PriceAdd) -> FieldResult<Price> {
        ensure!(price.prices.iter().all(|p| p.quantity > 0 && p.price > Money::new(0i64, p.price.cur())));

        let prices: serde_json::Value = price.prices.into();
        dbtry! {
            executor
                .context()
                .create_or_update_price(user_id, price.type_id, price.product_id, prices)
        }
    }

    field del_user_price(&executor, user_id: Option<i32>, price: PriceDel) -> FieldResult<bool> {
        dbtry! {
            executor
                .context()
                .delete_price(user_id, price.type_id, price.product_id)
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

    field add_user_record(&executor, user_id: Option<i32>, record: RecordAdd) -> FieldResult<Record> {
        ensure!(record.products.len() != 0);
        ensure!(record.con_id > 0);
        ensure!(record.price >= Money::new(0i64, record.price.cur()));

        dbtry! {
            executor
                .context()
                .create_user_record(user_id, record.con_id, record.products, record.price, record.time.naive_utc(), record.info)
        }
    }

    // Records
    field mod_user_record(&executor, user_id: Option<i32>, record: RecordMod) -> FieldResult<Record> { 
        ensure!(record.record_id > 0);
        ensure!(record.products.as_ref().map(|products| products.len() > 0).unwrap_or(true)); 
        ensure!(record.price.map(|price| price >= Money::new(0i64, price.cur())).unwrap_or(true));

        dbtry! {
            executor
                .context()
                .update_record(user_id, record.record_id, record.products, record.price, record.info)
        }
    }

    field del_user_record(&executor, user_id: Option<i32>, record: RecordDel) -> FieldResult<bool> {
        dbtry! {
            executor
                .context()
                .delete_record(user_id, record.record_id)
        }
    }

    field add_user_expense(&executor, user_id: Option<i32>, expense: ExpenseAdd) -> FieldResult<Expense> {
        ensure!(expense.con_id > 0);
        ensure!(expense.price >= Money::new(0i64, expense.price.cur()));
        ensure!(expense.category.len() > 0 && expense.category.len() < 32);

        dbtry! {
            executor
                .context()
                .create_user_expense(user_id, expense.con_id, expense.price, expense.category, expense.description, expense.time.naive_utc())
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
        dbtry! {
            executor
                .context()
                .delete_expense(user_id, expense.expense_id)
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
});
