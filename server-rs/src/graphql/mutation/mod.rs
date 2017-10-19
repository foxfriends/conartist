//! The entry point of a GraphQL mutation

mod product;
mod product_type;
mod price;
mod record;
mod expense;

use database::{Database, User, ProductType, ProductInInventory, Price, Convention, Record, Expense};
use self::product::*;
use self::product_type::*;
use self::price::*;
use self::record::*;
use self::expense::*;
use juniper::{FieldResult, FieldError, Value};

pub struct Mutation;

graphql_object!(Mutation: Database |&self| {
    description: "Entry-point for ConArtist GraphQL mutations"

    // Users
    field change_user_email(&executor, user_id: Option<i32>, email: String) -> FieldResult<User> {
        ensure!(email.len() > 0);

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
        ensure!(name.len() > 0);

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
        ensure!(product_type.name.len() > 0);
        ensure!(product_type.color >= 0);

        dbtry! {
            executor
                .context()
                .create_product_type(user_id, product_type.name, product_type.color)
        }
    }
    field mod_user_product_type(&executor, user_id: Option<i32>, product_type: ProductTypeMod) -> FieldResult<ProductType> {
        ensure!(product_type.type_id > 0);
        ensure!(product_type.name.as_ref().map(|s| s.len()).unwrap_or(1) > 0);
        ensure!(product_type.color.unwrap_or(0) >= 0);

        dbtry! {
            executor
                .context()
                .update_product_type(user_id, product_type.type_id, product_type.name, product_type.color, product_type.discontinued)
        }
    }

    // Products
    field add_user_product(&executor, user_id: Option<i32>, product: ProductAdd) -> FieldResult<ProductInInventory> {
        ensure!(product.name.len() > 0);
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
        ensure!(product.name.as_ref().map(|s| s.len()).unwrap_or(1) > 0);
        ensure!(product.quantity.unwrap_or(0) >= 0);

        dbtry! {
            executor
                .context()
                .update_product(user_id, product.product_id, product.name, product.quantity, product.discontinued)
        }
    }

    field add_user_price(&executor, user_id: Option<i32>, price: PriceAdd) -> FieldResult<Price> { Err(FieldError::new("Unimplemented", Value::null())) }
    field del_user_price(&executor, user_id: Option<i32>, price: PriceDel) -> FieldResult<()> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_convention(&executor, user_id: Option<i32>, con_code: String) -> FieldResult<Convention> { Err(FieldError::new("Unimplemented", Value::null())) }
    field del_user_convention(&executor, user_id: Option<i32>, con_code: String) -> FieldResult<Convention> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_record(&executor, user_id: Option<i32>, record: RecordAdd) -> FieldResult<Record> { Err(FieldError::new("Unimplemented", Value::null())) }
    field mod_user_record(&executor, user_id: Option<i32>, record: RecordMod) -> FieldResult<Record> { Err(FieldError::new("Unimplemented", Value::null())) }
    field del_user_record(&executor, user_id: Option<i32>, record: RecordDel) -> FieldResult<()> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_expense(&executor, user_id: Option<i32>, expense: ExpenseAdd) -> FieldResult<Expense> { Err(FieldError::new("Unimplemented", Value::null())) }
    field mod_user_expense(&executor, user_id: Option<i32>, expense: ExpenseMod) -> FieldResult<Expense> { Err(FieldError::new("Unimplemented", Value::null())) }
    field del_user_expense(&executor, user_id: Option<i32>, expense: ExpenseDel) -> FieldResult<()> { Err(FieldError::new("Unimplemented", Value::null())) }
});
