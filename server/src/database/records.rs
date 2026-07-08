use chrono::{DateTime, FixedOffset};
use diesel::{self, dsl, prelude::*, sql_types};
use uuid::Uuid;

use super::Database;
use super::models::*;
use super::schema::*;
use crate::money::Money;

impl Database {
    #[expect(clippy::too_many_arguments)]
    pub fn create_user_record(
        &self,
        maybe_user_id: Option<i32>,
        con_id: Option<i32>,
        gen_id: Uuid,
        products: Vec<i32>,
        discounts: Vec<i32>,
        price: Money,
        time: DateTime<FixedOffset>,
        info: String,
    ) -> Result<Record, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> QueryResult<Record> {
            let record_id = diesel::insert_into(records::table)
                .values((
                    records::user_id.eq(user_id),
                    records::con_id.eq(con_id),
                    records::price.eq(price.to_string()),
                    records::sale_time.eq(time.to_rfc3339()),
                    records::info.eq(info.clone()),
                    records::gen_id.eq(gen_id),
                ))
                .on_conflict((records::user_id, records::sale_time, records::gen_id))
                .do_update()
                .set(&RecordChanges::new(Some(price), Some(info)))
                .returning(records::record_id)
                .get_result::<i32>(conn)?;
            diesel::delete(recordproducts::table)
                .filter(recordproducts::record_id.eq(record_id))
                .execute(conn)?;
            diesel::insert_into(recordproducts::table)
                .values(
                    products
                        .iter()
                        .map(|product_id| (
                            recordproducts::record_id.eq(record_id),
                            recordproducts::product_id.eq(product_id)
                        ))
                        .collect::<Vec<_>>()
                )
                .execute(conn)?;
            diesel::delete(recorddiscounts::table)
                .filter(recorddiscounts::record_id.eq(record_id))
                .execute(conn)?;
            diesel::insert_into(recorddiscounts::table)
                .values(
                    discounts
                        .iter()
                        .map(|discount_id| (
                            recorddiscounts::record_id.eq(record_id),
                            recorddiscounts::discount_id.eq(discount_id)
                        ))
                        .collect::<Vec<_>>()
                )
                .execute(conn)?;
            records::table
                .select((
                    records::record_id,
                    records::user_id,
                    records::con_id,
                    records::price,
                    records::info,
                    records::sale_time,
                    records::gen_id,
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                    ),
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                    ),
                ))
                .filter(records::record_id.eq(record_id))
                .filter(records::user_id.eq(user_id))
                .group_by(records::record_id)
                .first::<Record>(conn)
        })
        .map_err(|reason| format!("Could not create record for user with id {} and convention with id {:?}. Reason: {}", user_id, con_id, reason))
    }

    pub fn update_record(
        &self,
        maybe_user_id: Option<i32>,
        record_id: i32,
        products: Option<Vec<i32>>,
        discounts: Option<Vec<i32>>,
        price: Option<Money>,
        info: Option<String>,
    ) -> Result<Record, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| -> QueryResult<Record> {
            diesel::update(records::table)
                .filter(records::record_id.eq(record_id))
                .filter(records::user_id.eq(user_id))
                .set(&RecordChanges::new(price, info))
                .execute(conn)?;
            if let Some(products) = products {
                diesel::delete(recordproducts::table)
                    .filter(recordproducts::record_id.eq(record_id))
                    .execute(conn)?;
                diesel::insert_into(recordproducts::table)
                    .values(
                        products
                            .into_iter()
                            .map(|product_id| {
                                (
                                    recordproducts::record_id.eq(record_id),
                                    recordproducts::product_id.eq(product_id),
                                )
                            })
                            .collect::<Vec<_>>(),
                    )
                    .execute(conn)?;
            }
            if let Some(discounts) = discounts {
                diesel::delete(recorddiscounts::table)
                    .filter(recorddiscounts::record_id.eq(record_id))
                    .execute(conn)?;
                diesel::insert_into(recorddiscounts::table)
                    .values(
                        discounts
                            .into_iter()
                            .map(|discount_id| {
                                (
                                    recorddiscounts::record_id.eq(record_id),
                                    recorddiscounts::discount_id.eq(discount_id),
                                )
                            })
                            .collect::<Vec<_>>(),
                    )
                    .execute(conn)?;
            }
            records::table
                .select((
                    records::record_id,
                    records::user_id,
                    records::con_id,
                    records::price,
                    records::info,
                    records::sale_time,
                    records::gen_id,
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                    ),
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                    ),
                ))
                .filter(records::record_id.eq(record_id))
                .filter(records::user_id.eq(user_id))
                .group_by(records::record_id)
                .first::<Record>(conn)
        })
        .map_err(|reason| {
            format!(
                "Could not update record with id {}. Reason: {}",
                record_id, reason
            )
        })
    }

    #[expect(clippy::too_many_arguments)]
    pub fn create_user_expense(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
        gen_id: Uuid,
        price: Money,
        category: String,
        description: String,
        time: DateTime<FixedOffset>,
    ) -> Result<Expense, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            diesel::insert_into(expenses::table)
                .values((
                    expenses::user_id.eq(user_id),
                    expenses::con_id.eq(con_id),
                    expenses::price.eq(price.to_string()),
                    expenses::category.eq(category.clone()),
                    expenses::description.eq(description.clone()),
                    expenses::spend_time.eq(time.to_rfc3339()),
                    expenses::gen_id.eq(gen_id),
                ))
                .on_conflict((expenses::user_id, expenses::spend_time, expenses::gen_id))
                .do_update()
                .set(&ExpenseChanges::new(Some(category), Some(description), Some(price)))
                .get_result::<Expense>(conn)
        })
        .map_err(|reason| format!("Could not create expense for user with id {} and convention with id {}. Reason: {}", user_id, con_id, reason))
    }

    pub fn get_records_for_user_con(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Vec<Record>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        records::table
            .select((
                records::record_id,
                records::user_id,
                records::con_id,
                records::price,
                records::info,
                records::sale_time,
                records::gen_id,
                dsl::sql::<sql_types::Array<sql_types::Int4>>(
                    "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                ),
                dsl::sql::<sql_types::Array<sql_types::Int4>>(
                    "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                ),
            ))
            .filter(records::user_id.eq(user_id))
            .filter(records::con_id.eq(con_id))
            .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").asc())
            .group_by(records::record_id)
            .load::<Record>(&mut conn)
            .map_err(|reason| {
                dbg!(&reason);
                format!("Records for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason)
            })
    }

    pub fn get_convention_record_total(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Option<Money>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        Ok(records::table
            .select(records::price)
            .filter(records::user_id.eq(user_id))
            .filter(records::con_id.eq(con_id))
            .load::<Money>(&mut conn)
            .map_err(|reason| {
                dbg!(&reason);
                format!("Records for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason)
            })?
            .into_iter()
            .fold(None, |b, a| { b.map(|b| { a + b }).or(Some(a)) }))
    }

    pub fn get_records_for_user(
        &self,
        maybe_user_id: Option<i32>,
        limit: i64,
        before: Option<i32>,
    ) -> Result<Vec<Record>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        if let Some(latest) = before {
            records::table
                .select((
                    records::record_id,
                    records::user_id,
                    records::con_id,
                    records::price,
                    records::info,
                    records::sale_time,
                    records::gen_id,
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                    ),
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                    ),
                ))
                .filter(records::user_id.eq(user_id))
                .filter(records::con_id.is_null())
                .filter(records::record_id.lt(latest))
                .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").desc())
                .group_by(records::record_id)
                .limit(limit)
                .load::<Record>(&mut conn)
                .map_err(|reason| {
                    format!(
                        "Records for user with id {} could not be retrieved. Reason: {}",
                        user_id, reason
                    )
                })
        } else {
            records::table
                .select((
                    records::record_id,
                    records::user_id,
                    records::con_id,
                    records::price,
                    records::info,
                    records::sale_time,
                    records::gen_id,
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                    ),
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                    ),
                ))
                .filter(records::user_id.eq(user_id))
                .filter(records::con_id.is_null())
                .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").desc())
                .group_by(records::record_id)
                .limit(limit)
                .load::<Record>(&mut conn)
                .map_err(|reason| {
                    format!(
                        "Records for user with id {} could not be retrieved. Reason: {}",
                        user_id, reason
                    )
                })
        }
    }

    pub fn get_record_by_id(
        &self,
        maybe_user_id: Option<i32>,
        record_id: Option<i32>,
        uuid: Option<Uuid>,
    ) -> Result<Record, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();

        if let Some(record_id) = record_id {
            records::table
                .select((
                    records::record_id,
                    records::user_id,
                    records::con_id,
                    records::price,
                    records::info,
                    records::sale_time,
                    records::gen_id,
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                    ),
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                    ),
                ))
                .filter(records::record_id.eq(record_id))
                .filter(records::user_id.eq(user_id))
                .group_by(records::record_id)
                .first::<Record>(&mut conn)
                .map_err(|reason| {
                    format!(
                        "Record with id {} could not be retrieved. Reason: {}",
                        record_id, reason,
                    )
                })
        } else if let Some(uuid) = uuid {
            records::table
                .select((
                    records::record_id,
                    records::user_id,
                    records::con_id,
                    records::price,
                    records::info,
                    records::sale_time,
                    records::gen_id,
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(product_id) from recordproducts where recordproducts.record_id = records.record_id), '{}'::int4[])",
                    ),
                    dsl::sql::<sql_types::Array<sql_types::Int4>>(
                        "coalesce((select array_agg(discount_id) from recorddiscounts where recorddiscounts.record_id = records.record_id), '{}'::int4[])",
                    ),
                ))
                .filter(records::gen_id.eq(uuid))
                .filter(records::user_id.eq(user_id))
                .group_by(records::record_id)
                .first::<Record>(&mut conn)
                .map_err(|reason| {
                    format!(
                        "Record with id {} could not be retrieved. Reason: {}",
                        uuid, reason,
                    )
                })
        } else {
            Err("Could not retrieve record with no id or uuid".to_owned())
        }
    }

    pub fn count_records_for_user(&self, maybe_user_id: Option<i32>) -> i64 {
        let user_id = match self.resolve_user_id_protected(maybe_user_id) {
            Ok(user_id) => user_id,
            Err(..) => return 0,
        };
        let mut conn = self.pool.get().unwrap();
        records::table
            .select(dsl::count(records::record_id))
            .filter(records::user_id.eq(user_id))
            .filter(records::con_id.is_null())
            .order(dsl::sql::<sql_types::Timestamptz>("sale_time::timestamptz").desc())
            .count()
            .first::<i64>(&mut conn)
            .unwrap_or(0)
    }

    pub fn get_expenses_for_user_con(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Vec<Expense>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        expenses::table
            .filter(expenses::user_id.eq(user_id))
            .filter(expenses::con_id.eq(con_id))
            .order(dsl::sql::<sql_types::Timestamptz>("spend_time::timestamptz").asc())
            .load::<Expense>(&mut conn)
            .map_err(|reason| format!("Expenses for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))
    }

    pub fn get_convention_expense_total(
        &self,
        maybe_user_id: Option<i32>,
        con_id: i32,
    ) -> Result<Option<Money>, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        Ok(expenses::table
            .select(expenses::price)
            .filter(expenses::user_id.eq(user_id))
            .filter(expenses::con_id.eq(con_id))
            .load::<Money>(&mut conn)
            .map_err(|reason| format!("Expenses for convention with id {} for user with id {} could not be retrieved. Reason: {}", con_id, user_id, reason))?
            .into_iter()
            .fold(None, |b, a| { b.map(|b| { a + b }).or(Some(a)) }))
    }

    pub fn delete_record(
        &self,
        maybe_user_id: Option<i32>,
        record_id: Option<i32>,
        uuid: Option<Uuid>,
    ) -> Result<bool, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let mut conn = self.pool.get().unwrap();
        conn.transaction(|conn| {
            let found_record_id = if let Some(record_id) = record_id {
                records::table
                    .select(records::record_id)
                    .filter(records::record_id.eq(record_id))
                    .filter(records::user_id.eq(user_id))
                    .first::<i32>(conn)?
            } else if let Some(uuid) = uuid {
                records::table
                    .select(records::record_id)
                    .filter(records::gen_id.eq(uuid))
                    .filter(records::user_id.eq(user_id))
                    .first::<i32>(conn)?
            } else {
                return Err(diesel::result::Error::DeserializationError(Box::new(
                    crate::error::StringError(
                        "Could not retrieve record with no id or uuid".to_owned(),
                    ),
                )));
            };

            diesel::delete(records::table)
                .filter(records::record_id.eq(found_record_id))
                .execute(conn)
                .map(|size| size == 1)
        })
        .map_err(|reason| {
            format!(
                "Could not delete record with id {:?} or uuid {:?} for user with id {}. Reason: {}",
                record_id, uuid, user_id, reason
            )
        })
    }
}
