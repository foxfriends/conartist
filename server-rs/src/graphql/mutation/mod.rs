//! The entry point of a GraphQL mutation

mod product;
mod product_type;
mod price;
mod record;

use database::{Database, User, ProductType, ProductInInventory, Price, Convention, Record};
use self::product::*;
use self::product_type::*;
use self::price::*;
use self::record::*;
use juniper::{FieldResult, FieldError, Value};

pub struct Mutation;

graphql_object!(Mutation: Database |&self| {
    description: "Entry-point for ConArtist GraphQL mutations"

    field change_user_email(&executor, user_id: i32, email: String) -> FieldResult<User> {
        dbtry! {
            executor
                .context()
                .set_user_email(user_id, email)
        }
    }
    field change_user_password(&executor, user_id: i32, orig_password: String, password: String) -> FieldResult<User> {
        dbtry! {
            executor
                .context()
                .set_user_password(user_id, orig_password, password)
        }
    }

    field add_user_product_type(&executor, user_id: i32, product_type: ProductTypeAdd) -> FieldResult<ProductType> { Err(FieldError::new("Unimplemented", Value::null())) }
    field mod_user_product_type(&executor, user_id: i32, product_type: ProductTypeMod) -> FieldResult<ProductType> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_product(&executor, user_id: i32, product: ProductAdd) -> FieldResult<ProductInInventory> { Err(FieldError::new("Unimplemented", Value::null())) }
    field mod_user_product(&executor, user_id: i32, product: ProductMod) -> FieldResult<ProductInInventory> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_price(&executor, user_id: i32, product: PriceAdd) -> FieldResult<Price> { Err(FieldError::new("Unimplemented", Value::null())) }
    field mod_user_price(&executor, user_id: i32, product: PriceMod) -> FieldResult<Price> { Err(FieldError::new("Unimplemented", Value::null())) } // TODO: is this required? or is mod just del->add
    field del_user_price(&executor, user_id: i32, product: PriceDel) -> FieldResult<()> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_convention(&executor, user_id: i32, con_code: String) -> FieldResult<Convention> { Err(FieldError::new("Unimplemented", Value::null())) }
    field del_user_convention(&executor, user_id: i32, con_code: String) -> FieldResult<Convention> { Err(FieldError::new("Unimplemented", Value::null())) }

    field add_user_record(&executor, user_id: i32, con_code: String, product: RecordAdd) -> FieldResult<Record> { Err(FieldError::new("Unimplemented", Value::null())) }
});
