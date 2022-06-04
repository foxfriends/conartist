use diesel::prelude::*;
use diesel::{self, dsl, sql_types};
use std::collections::HashMap;

use super::dsl::*;
use super::models::*;
use super::schema::*;
use super::Database;

impl Database {
    pub fn create_product(
        &self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        name: String,
        sku: Option<String>,
        quantity: i32,
        sort: i32,
    ) -> Result<ProductSnapshot, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| -> diesel::result::QueryResult<ProductSnapshot> {
            let product = diesel::insert_into(products::table)
                .values((
                    products::user_id.eq(user_id),
                    products::type_id.eq(type_id),
                    products::name.eq(name),
                    products::sort.eq(sort),
                    products::sku.eq(sku),
                ))
                .get_result::<Product>(&*conn)?;

            diesel::insert_into(inventory::table)
                .values((
                    inventory::product_id.eq(product.product_id),
                    inventory::quantity.eq(quantity),
                ))
                .execute(&*conn)?;

            Ok(product.with_snapshot_data(quantity as i64, false))
        })
        .map_err(|reason| {
            format!(
                "Failed to create new product for user with id {}. Reason: {}",
                user_id, reason
            )
        })
    }

    pub fn get_products_for_user(
        &self,
        maybe_user_id: Option<i32>,
    ) -> Result<Vec<ProductSnapshot>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        // TODO: was nice when the counting could be done in SQL... maybe someday it can be improved
        let items_sold: HashMap<i32, i64> = records::table
            .select(unnest(records::products))
            .filter(records::user_id.eq(user_id))
            .load::<i32>(&*conn)
            .map_err(|reason| {
                format!(
                    "Records for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })?
            .into_iter()
            .fold(HashMap::new(), |mut map, index| {
                let amt = map.get(&index).unwrap_or(&0i64) + 1;
                map.insert(index, amt);
                map
            });

        let latest_event_type = productevents::table
            .select(productevents::event_type)
            .filter(
                productevents::event_type
                    .eq(EventType::Enabled)
                    .or(productevents::event_type.eq(EventType::Disabled)),
            )
            .filter(productevents::product_id.eq(products::product_id))
            .order_by(productevents::event_time.desc())
            .limit(1)
            .single_value();

        let product_snapshots = products::table
            .left_outer_join(inventory::table)
            .select((
                products::product_id,
                products::type_id,
                products::user_id,
                products::name,
                products::sort,
                products::sku,
                dsl::sql::<sql_types::BigInt>("coalesce(sum(inventory.quantity), 0)"),
                latest_event_type.eq(EventType::Disabled),
            ))
            .filter(products::user_id.eq(user_id))
            .filter(products::deleted.eq(false))
            .group_by(products::product_id)
            .order((products::sort.asc(), products::product_id.asc()))
            .load::<ProductSnapshot>(&*conn)
            .map_err(|reason| {
                format!(
                    "Products for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })?;

        Ok(product_snapshots
            .into_iter()
            .map(|product| {
                let sold_amount = *items_sold.get(&product.product_id).unwrap_or(&0i64);
                ProductSnapshot {
                    quantity: i64::max(0, product.quantity - sold_amount),
                    ..product
                }
            })
            .collect())
    }

    pub fn update_product(
        &self,
        maybe_user_id: Option<i32>,
        product_id: i32,
        name: Option<String>,
        sku: Option<String>,
        quantity: Option<i32>,
        discontinued: Option<bool>,
        sort: Option<i32>,
    ) -> Result<ProductSnapshot, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        conn.transaction(|| {
            let product = products::table
                .filter(products::product_id.eq(product_id))
                .filter(products::user_id.eq(user_id));
            if !diesel::select(dsl::exists(product)).get_result::<bool>(&*conn)? {
                return Err(diesel::result::Error::NotFound);
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

            let updated_product: Product = if name.is_some() || sort.is_some() || sku.is_some() {
                let sku = sku.map(|sku| if sku == "" { None } else { Some(sku) });
                diesel::update(products::table)
                    .filter(products::product_id.eq(product_id))
                    .filter(products::user_id.eq(user_id))
                    .set(&ProductChanges { name, sort, sku })
                    .get_result(&*conn)?
            } else {
                products::table
                    .filter(products::product_id.eq(product_id))
                    .first(&*conn)?
            };

            let previously_discontinued = productevents::table
                .select(productevents::event_type)
                .filter(productevents::product_id.eq(product_id))
                .filter(
                    productevents::event_type
                        .eq(EventType::Disabled)
                        .or(productevents::event_type.eq(EventType::Enabled)),
                )
                .order_by(productevents::event_time.desc())
                .first::<EventType>(&*conn)
                .optional()?
                == Some(EventType::Disabled);
            let is_now_discontinued = if let Some(discontinued) = discontinued {
                if discontinued != previously_discontinued {
                    diesel::insert_into(productevents::table)
                        .values((
                            productevents::product_id.eq(product_id),
                            productevents::event_type.eq(if discontinued {
                                EventType::Disabled
                            } else {
                                EventType::Enabled
                            }),
                        ))
                        .execute(&*conn)?;
                }
                discontinued
            } else {
                previously_discontinued
            };

            let total = inventory::table
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
                    .values((
                        inventory::product_id.eq(product_id),
                        inventory::quantity.eq(quantity_delta as i32),
                    ))
                    .execute(&*conn)?;
            }

            Ok(updated_product.with_snapshot_data(
                quantity.unwrap_or(i64::max(0, total - sold) as i32) as i64,
                is_now_discontinued,
            ))
        })
        .map_err(|reason| {
            format!(
                "Could not update product with id {}. Reason: {}",
                product_id, reason
            )
        })
    }

    pub fn delete_product(
        &self,
        maybe_user_id: Option<i32>,
        product_id: i32,
    ) -> Result<bool, String> {
        self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conn.transaction(|| -> diesel::result::QueryResult<bool> {
            let any_sold = diesel::select(dsl::exists(
                records::table.filter(records::products.contains(&vec![product_id])),
            ))
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
        .map_err(|reason| {
            format!(
                "Could not delete product with id {}. Reason: {}",
                product_id, reason
            )
        })
    }
}
