//! Holds information about a convention and a user's products, prices, and records during that convention
use database::Database;
use chrono::{DateTime, Utc};
use juniper::FieldResult;
use database::{ProductType, ProductInInventory, Price, PriceRow, FullUserConvention, Record, Expense};

graphql_object!(FullUserConvention: Database |&self| {
    description: "Holds information about a convention and a user's products, prices, and records during that convention"

    field id() -> i32 { self.con_id }
    field user_id() -> i32 { self.user_id }
    field con_id() -> i32 { self.con_id }
    field code() -> &String { &self.code }
    field name() -> &String { &self.title }
    field start() -> DateTime<Utc> { DateTime::from_utc(self.start_date.and_hms(0, 0, 0), Utc) }
    field end() -> DateTime<Utc> { DateTime::from_utc(self.end_date.and_hms(23, 59, 59), Utc) }

    // TODO: Option to retrieve all non-discontinued products instead of just products attached to
    //       this convention
    field product_types(&executor) -> FieldResult<Vec<ProductType>> {
        dbtry! {
            executor
                .context()
                .get_product_types_for_user(self.user_id)
        }
    }

    field products(&executor, include_all = false: bool) -> FieldResult<Vec<ProductInInventory>> {
        dbtry! {
            executor
                .context()
                .get_products_for_user_con(self.user_id, self.user_con_id, include_all)
        }
    }

    field condensedPrices(&executor, include_all = false: bool) ->  FieldResult<Vec<Price>> {
        dbtry! {
            executor
                .context()
                .get_prices_for_user_con(self.user_id, self.user_con_id, include_all)
        }
    }

    field prices(&executor, include_all = false: bool) -> FieldResult<Vec<PriceRow>> {
        dbtry! {
            executor
                .context()
                .get_prices_for_user_con(self.user_id, self.user_con_id, include_all)
                .map(|prices| prices
                    .into_iter()
                    .fold(vec![], |prev, price| {
                        let len = prev.len() as i32;
                        prev.into_iter().chain(price.spread(len)).collect()
                    })
                )
        }
    }

    field records(&executor) -> FieldResult<Vec<Record>> {
        dbtry! {
            executor
                .context()
                .get_records_for_user_con(self.user_id, self.user_con_id)
        }
    }

    field expenses(&executor) -> FieldResult<Vec<Expense>> {
        dbtry! {
            executor
                .context()
                .get_expenses_for_user_con(self.user_id, self.user_con_id)
        }
    }
});
