//! Holds information about a user convention
use database::Database;
use juniper::FieldResult;
pub use database::{ProductType, ProductInInventory, PriceRow, UserConvention};

graphql_object!(UserConvention: Database |&self| {
    description: "Holds information about a user convention"

    field id() -> i32 { self.con_id }
    field user_id() -> i32 { self.user_id }

    field product_types(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_product_types_for_user(self.user_id)
        }
    }

    field products(&executor) -> FieldResult<Vec<ProductInInventory>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user_con(self.user_id, self.user_con_id)
        }
    }

    field prices(&executor) -> FieldResult<Vec<PriceRow>> {
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
