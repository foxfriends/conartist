use diesel::{self, dsl, prelude::*};

use super::dsl::*;
use super::models::*;
use super::schema::*;
use super::Database;

impl Database {
    pub fn create_product_type(
        &self,
        maybe_user_id: Option<i32>,
        name: String,
        color: i32,
        sort: i32,
    ) -> Result<ProductType, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::insert_into(producttypes::table)
            .values((
                producttypes::user_id.eq(user_id),
                producttypes::name.eq(name),
                producttypes::color.eq(color),
                producttypes::sort.eq(sort),
            ))
            .get_result::<ProductType>(&*conn)
            .map_err(|reason| {
                format!(
                    "Failed to create new product type for user with id {}. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn get_all_product_types_for_user(
        &self,
        maybe_user_id: Option<i32>,
    ) -> Result<Vec<ProductType>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        producttypes::table
            .filter(producttypes::user_id.eq(user_id))
            .order((producttypes::sort.asc(), producttypes::type_id.asc()))
            .load::<ProductType>(&*conn)
            .map_err(|reason| {
                format!(
                    "ProductTypes for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn get_product_types_for_user(
        &self,
        maybe_user_id: Option<i32>,
    ) -> Result<Vec<ProductType>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        producttypes::table
            .filter(producttypes::user_id.eq(user_id))
            .filter(producttypes::deleted.eq(false))
            .order((producttypes::sort.asc(), producttypes::type_id.asc()))
            .load::<ProductType>(&*conn)
            .map_err(|reason| {
                format!(
                    "ProductTypes for user with id {} could not be retrieved. Reason: {}",
                    user_id, reason
                )
            })
    }

    pub fn update_product_type(
        &self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        name: Option<String>,
        color: Option<i32>,
        discontinued: Option<bool>,
        sort: Option<i32>,
    ) -> Result<ProductType, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        diesel::update(producttypes::table)
            .filter(producttypes::type_id.eq(type_id))
            .filter(producttypes::user_id.eq(user_id))
            .set(&ProductTypeChange {
                name,
                color,
                discontinued,
                sort,
            })
            .get_result(&*conn)
            .map_err(|reason| {
                format!(
                    "Could not update product type with id {}. Reason: {}",
                    type_id, reason
                )
            })
    }

    /// In order to be able to delete a product type, we must first check that none of its products
    /// have ever had a sale before. If no records contain any products of this type, then we can
    /// delete the product type and all its associated products. Otherwise, we just try and delete
    /// all the products, but mark this product type as 'deleted' via the flag.
    pub fn delete_product_type(
        &self,
        maybe_user_id: Option<i32>,
        type_id: i32,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();

        conn.transaction(|| -> diesel::result::QueryResult<bool> {
            let sold_products = records::table
                .select(unnest(records::products))
                .distinct()
                .filter(records::user_id.eq(user_id))
                .load::<i32>(&*conn)?;
            diesel::delete(products::table)
                .filter(products::type_id.eq(type_id))
                .filter(dsl::not(products::product_id.eq(dsl::any(sold_products))))
                .execute(&*conn)?;
            let products_left = diesel::select(dsl::exists(
                products::table.filter(products::type_id.eq(type_id)),
            ))
            .get_result::<bool>(&*conn)?;
            diesel::delete(prices::table)
                .filter(prices::type_id.eq(type_id))
                .execute(&*conn)?;
            if products_left {
                diesel::update(products::table)
                    .filter(products::type_id.eq(type_id))
                    .set(products::deleted.eq(true))
                    .execute(&*conn)?;
                diesel::update(producttypes::table)
                    .filter(producttypes::type_id.eq(type_id))
                    .set(producttypes::deleted.eq(true))
                    .execute(&*conn)?;
                Ok(false)
            } else {
                diesel::delete(producttypes::table.filter(producttypes::type_id.eq(type_id)))
                    .execute(&*conn)?;
                Ok(true)
            }
        })
        .map_err(|reason| {
            format!(
                "Could not delete product type with id {}. Reason: {}",
                type_id, reason
            )
        })
    }
}
