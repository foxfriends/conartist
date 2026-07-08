use diesel::dsl;
use diesel::dsl::now;
use diesel::prelude::*;
use diesel::sql_types;

use crate::money::Money;

use super::Database;
use super::models::*;
use super::schema::*;

impl Database {
    pub fn get_discounts_for_user(
        &self,
        maybe_user_id: Option<i32>,
    ) -> Result<Vec<Discount>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        discounts::table
            .select((
                discounts::discount_id,
                discounts::user_id,
                discounts::flat_amount,
                discounts::percentage_amount,
                discounts::name,
                discounts::created_at,
                discounts::deleted_at,
                dsl::sql::<sql_types::Array<sql_types::Int4>>(
                    "coalesce((select array_agg(product_id) from discountproducts where discountproducts.discount_id = discounts.discount_id), '{}'::int4[])",
                ),
                dsl::sql::<sql_types::Array<sql_types::Int4>>(
                    "coalesce((select array_agg(type_id) from discountproducttypes where discountproducttypes.discount_id = discounts.discount_id), '{}'::int4[])",
                ),
            ))
            .filter(discounts::user_id.eq(user_id))
            .group_by(discounts::discount_id)
            .load::<Discount>(&mut conn)
            .map_err(|reason| {
                format!(
                    "Discounts for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn create_discount(
        &self,
        maybe_user_id: Option<i32>,
        name: String,
        flat_amount: Option<Money>,
        percentage_amount: Option<f64>,
        product_ids: Vec<i32>,
        product_type_ids: Vec<i32>,
    ) -> Result<Discount, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> diesel::result::QueryResult<Discount> {
            let discount = diesel::insert_into(discounts::table)
                .values((
                    discounts::user_id.eq(user_id),
                    discounts::name.eq(name),
                    discounts::flat_amount.eq(flat_amount.map(|price| price.to_string())),
                    discounts::percentage_amount.eq(percentage_amount),
                ))
                .get_result::<DiscountRow>(conn)?;

            if !product_ids.is_empty() {
                diesel::insert_into(discountproducts::table)
                    .values(
                        product_ids
                            .iter()
                            .map(|product_id| {
                                (
                                    discountproducts::discount_id.eq(discount.discount_id),
                                    discountproducts::product_id.eq(product_id),
                                )
                            })
                            .collect::<Vec<_>>(),
                    )
                    .execute(conn)?;
            }

            if !product_type_ids.is_empty() {
                diesel::insert_into(discountproducttypes::table)
                    .values(
                        product_type_ids
                            .iter()
                            .map(|type_id| {
                                (
                                    discountproducttypes::discount_id.eq(discount.discount_id),
                                    discountproducttypes::type_id.eq(type_id),
                                )
                            })
                            .collect::<Vec<_>>(),
                    )
                    .execute(conn)?;
            }

            Ok(discount.with(product_ids, product_type_ids))
        })
        .map_err(|reason| {
            format!(
                "Failed to create new discount for user with id {}. Reason: {}",
                user_id, reason
            )
        })
    }

    pub fn delete_discount(
        &self,
        maybe_user_id: Option<i32>,
        discount_id: i32,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let is_used = diesel::select(dsl::exists(
                recorddiscounts::table.filter(recorddiscounts::discount_id.eq(discount_id)),
            ))
            .get_result::<bool>(conn)?;
            if is_used {
                diesel::update(discounts::table)
                    .set(discounts::deleted_at.eq(now))
                    .filter(discounts::discount_id.eq(discount_id))
                    .filter(discounts::user_id.eq(user_id))
                    .execute(conn)
                    .map(|size| size == 1)
            } else {
                diesel::delete(discounts::table)
                    .filter(discounts::discount_id.eq(discount_id))
                    .filter(discounts::user_id.eq(user_id))
                    .execute(conn)
                    .map(|size| size == 1)
            }
        })
        .map_err(|reason| {
            format!(
                "Could not delete discount with id {:?} for user with id {}. Reason: {}",
                discount_id, user_id, reason
            )
        })
    }
}
