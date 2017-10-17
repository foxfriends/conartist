//! The entry point of a GraphQL mutation

mod product;
mod product_type;
mod price;
mod record;

use database::{Database, User};
use self::product::*;
use self::product_type::*;
use self::price::*;
use self::record::*;
use juniper::FieldResult;

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

    field add_user_product_type(&executor, user_id: i32, product_type: ProductTypeAdd) -> i32 { 0 }
    field mod_user_product_type(&executor, user_id: i32, product_type: ProductTypeMod) -> i32 { 0 }

    field add_user_product(&executor, user_id: i32, product: ProductAdd) -> i32 { 0 }
    field mod_user_product(&executor, user_id: i32, product: ProductMod) -> i32 { 0 }

    field add_user_price(&executor, user_id: i32, product: PriceAdd) -> i32 { 0 }
    field mod_user_price(&executor, user_id: i32, product: PriceMod) -> i32 { 0 } // TODO: is this required? or is mod just del->add
    field del_user_price(&executor, user_id: i32, product: PriceDel) -> i32 { 0 }

    field add_user_convention(&executor, user_id: i32, con_code: String) -> i32 { 0 }
    field del_user_convention(&executor, user_id: i32, con_code: String) -> i32 { 0 }

    field add_user_record(&executor, user_id: i32, con_code: String, product: RecordAdd) -> i32 { 0 }
});
