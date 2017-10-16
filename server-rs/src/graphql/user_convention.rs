//! Holds information about a convention and a user's products, prices, and records during that convention
use database::Database;
use juniper::FieldResult;
pub use database::{ProductType, ProductInInventory, PriceRow, FullUserConvention};

graphql_object!(FullUserConvention: Database |&self| {
    description: "Holds information about a convention and a user's products, prices, and records during that convention"

    field id() -> i32 { self.con_id }
    field user_id() -> i32 { self.user_id }
    field code() -> &String { &self.code }
    field name() -> &String { &self.title }
    // TODO: Having trouble returning a NaiveDate here
    field start() -> String { self.start_date.to_string() }
    field end() -> String { self.end_date.to_string() }

    field product_type(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_product_types_for_user(self.user_id)
        }
    }

    field product(&executor) -> FieldResult<Vec<ProductInInventory>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user_con(self.user_id, self.user_con_id)
        }
    }

    field price(&executor) -> FieldResult<Vec<PriceRow>> {
        dbtry! {
            executor
                .context()
                .get_prices_for_user_con(self.user_id, self.user_con_id)
                .map(|prices| prices
                    .into_iter()
                    .fold(vec![], |prev, price| {
                        let len = prev.len() as i32;
                        prev.into_iter().chain(price.spread(len)).collect()
                    })
                )
        }
    }
});
