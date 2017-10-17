//! The entry point of a GraphQL mutation

mod product;
mod product_type;
mod price;
mod record;

use database::Database;
use self::product::*;
use self::product_type::*;
use self::price::*;
use self::record::*;

pub struct Mutation;

graphql_object!(Mutation: Database |&self| {
    description: "Entry-point for ConArtist GraphQL mutations"

    field change_user_email(user_id: i32, email: String) -> i32 { 0 }
    field change_user_password(user_id: i32, password: String) -> i32 { 0 }

    field add_user_product_type(user_id: i32, product_type: ProductTypeAdd) -> i32 { 0 }
    field mod_user_product_type(user_id: i32, product_type: ProductTypeMod) -> i32 { 0 }

    field add_user_product(user_id: i32, product: ProductAdd) -> i32 { 0 }
    field mod_user_product(user_id: i32, product: ProductMod) -> i32 { 0 }

    field add_user_price(user_id: i32, product: PriceAdd) -> i32 { 0 }
    field mod_user_price(user_id: i32, product: PriceMod) -> i32 { 0 } // TODO: is this required? or is mod just del->add
    field del_user_price(user_id: i32, product: PriceDel) -> i32 { 0 }

    field add_user_convention(user_id: i32, con_code: String) -> i32 { 0 }
    field del_user_convention(user_id: i32, con_code: String) -> i32 { 0 }

    field add_user_record(user_id: i32, con_code: String, product: RecordAdd) -> i32 { 0 }
});
