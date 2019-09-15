use diesel::{self, dsl, sql_types};
use diesel::prelude::*;
use std::collections::HashMap;

use super::schema::*;
use super::models::*;
use super::dsl::*;
use super::Database;

impl Database {
    pub fn create_product(&self, maybe_user_id: Option<i32>, type_id: i32, name: String, quantity: i32, sort: i32) -> Result<ProductWithQuantity, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| -> diesel::result::QueryResult<ProductWithQuantity> {
                let product =
                    diesel::insert_into(products::table)
                        .values((products::user_id.eq(user_id), products::type_id.eq(type_id), products::name.eq(name), products::sort.eq(sort)))
                        .get_result::<Product>(&*conn)?;

                diesel::insert_into(inventory::table)
                    .values((inventory::product_id.eq(product.product_id), inventory::quantity.eq(quantity)))
                    .execute(&*conn)?;

                Ok(product.with_quantity(quantity as i64))
            })
            .map_err(|reason| format!("Failed to create new product for user with id {}. Reason: {}", user_id, reason))
    }

    pub fn get_products_for_user(&self, maybe_user_id: Option<i32>) -> Result<Vec<ProductWithQuantity>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        // TODO: was nice when the counting could be done in SQL... maybe someday it can be improved
        let items_sold: HashMap<i32, i64> = records::table
            .select(unnest(records::products))
            .filter(records::user_id.eq(user_id))
            .load::<i32>(&*conn)
            .map_err(|reason| format!("Records for user with id {} could not be retrieved. Reason: {}", user_id, reason))?
            .into_iter()
            .fold(HashMap::new(), |mut map, index| {
                let amt = map.get(&index).unwrap_or(&0i64) + 1;
                map.insert(index, amt);
                map
            });

        let products_with_quantity = products::table
            .left_outer_join(inventory::table)
            .select((products::product_id, products::type_id, products::user_id, products::name, products::sort, products::discontinued, dsl::sql::<sql_types::BigInt>("coalesce(sum(inventory.quantity), 0)")))
            .filter(products::user_id.eq(user_id))
            .filter(products::deleted.eq(false))
            .group_by(products::product_id)
            .order((products::sort.asc(), products::product_id.asc()))
            .load::<ProductWithQuantity>(&*conn)
            .map_err(|reason| format!("Products for user with id {} could not be retrieved. Reason: {}", user_id, reason))?;

        Ok(products_with_quantity
            .into_iter()
            .map(|product| {
                 let sold_amount = *items_sold.get(&product.product_id).unwrap_or(&0i64);
                 ProductWithQuantity { quantity: i64::max(0, product.quantity - sold_amount), ..product }
            })
            .collect())
    }

    pub fn update_product(&self,
        maybe_user_id: Option<i32>,
        product_id: i32,
        name: Option<String>,
        quantity: Option<i32>,
        discontinued: Option<bool>,
        sort: Option<i32>,
    ) -> Result<ProductWithQuantity, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        conn.transaction(|| {
                let product =
                    products::table
                        .filter(products::product_id.eq(product_id))
                        .filter(products::user_id.eq(user_id));
                if !diesel::select(dsl::exists(product)).get_result::<bool>(&*conn)? {
                    return Err(diesel::result::Error::NotFound)
                }

                let sold = records::table
                    .select(unnest(records::products))
                    .filter(records::user_id.eq(user_id))
                    .load::<i32>(&*conn)
                    .unwrap_or(vec![])
                    .into_iter()
                    .filter(|id| *id == product_id)
                    .collect::<Vec<_>>()
                    .len() as i64;

                let updated_product: Product =
                    if name.is_some() || discontinued.is_some() || sort.is_some() {
                        diesel::update(products::table)
                            .filter(products::product_id.eq(product_id))
                            .filter(products::user_id.eq(user_id))
                            .set(&ProductChanges { name, discontinued, sort })
                            .get_result(&*conn)?
                    } else {
                        products::table
                            .filter(products::product_id.eq(product_id))
                            .first(&*conn)?
                    };

                let total =
                    inventory::table
                        .select(dsl::sum(inventory::quantity))
                        .filter(inventory::product_id.eq(product_id))
                        .group_by(inventory::product_id)
                        .first::<_>(&*conn)
                        .unwrap_or(None)
                        .unwrap_or(0i64);

                if let Some(quantity) = quantity {
                    // Allow (total-sold) here to be negative to compensate for overselling miscounted
                    // items
                    let quantity_delta = (quantity as i64) - (total - sold);
                    diesel::insert_into(inventory::table)
                        .values((inventory::product_id.eq(product_id), inventory::quantity.eq(quantity_delta as i32)))
                        .execute(&*conn)?;
                }

                Ok(updated_product.with_quantity(quantity.unwrap_or(i64::max(0, total - sold) as i32) as i64))
            })
            .map_err(|reason| format!("Could not update product with id {}. Reason: {}", product_id, reason))
    }

    pub fn delete_product(&self, maybe_user_id: Option<i32>, product_id: i32) -> Result<bool, String> {
        self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| -> diesel::result::QueryResult<bool> {
                let any_sold = diesel::select(dsl::exists(records::table
                    .filter(records::products.contains(&vec![product_id]))))
                    .get_result::<bool>(&*conn)?;
                diesel::delete(prices::table)
                    .filter(prices::product_id.eq(product_id))
                    .execute(&*conn)?;
                if any_sold {
                    diesel::update(products::table)
                        .filter(products::product_id.eq(product_id))
                        .set(products::deleted.eq(true))
                        .execute(&*conn)?;
                    Ok(false)
                } else {
                    diesel::delete(products::table)
                        .filter(products::product_id.eq(product_id))
                        .execute(&*conn)?;
                    Ok(true)
                }
            })
            .map_err(|reason| format!("Could not delete product with id {}. Reason: {}", product_id, reason))
    }
}
