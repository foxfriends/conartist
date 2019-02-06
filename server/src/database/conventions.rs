use diesel::{dsl, sql_types};
use diesel::prelude::*;
use chrono::NaiveDate;

use super::Database;
use super::models::*;
use super::schema::*;
use super::dsl::*;
use crate::search::Search;
use super::views::*;

impl Database {
    pub fn get_convention(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<Convention, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conventions::table
            .filter(conventions::con_id.eq(con_id))
            .first::<DetachedConvention>(&*conn)
            .map(|con| con.attached_to(user_id))
            .map_err(|reason| format!("Convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }

    pub fn get_conventions_after(&self, search: Option<&Search>, date: NaiveDate, limit: i64, after: Option<&String>) -> Result<Vec<Convention>, String> {
        let conn = self.pool.get().unwrap();
        let mut query = conventionsearch::table
            .select((
                conventionsearch::con_id,
                conventionsearch::title,
                conventionsearch::start_date,
                conventionsearch::end_date,
                conventionsearch::predecessor,
            ))
            .filter(conventionsearch::end_date.ge(date))
            .offset(after.clone().and_then(|offset| str::parse(&offset).ok()).unwrap_or(0i64))
            .limit(limit)
            .into_boxed();
        if let Some(search) = search {
            let body_score = string_score(conventionsearch::title, search.body(), 0.5);
            query = query
                .filter(body_score.gt(0.33))
                .then_order_by(body_score.desc());

            if let Some(country) = search.value("country") {
                let country_score = string_score_exact(conventionsearch::country, country);
                query = query
                    .filter(country_score.gt(0f64))
                    .then_order_by(country_score.desc());
            }

            if let Some(city) = search.value("city") {
                let city_score = string_score_exact(conventionsearch::city, city);
                query = query
                    .filter(city_score.gt(0f64))
                    .then_order_by(city_score.desc());
            }
        }

        query
            .then_order_by(conventionsearch::start_date.asc())
            .then_order_by(conventionsearch::end_date.asc())
            .then_order_by(conventionsearch::con_id.asc())
            .load::<DetachedConvention>(&*conn)
            .map(|cons| cons.into_iter().map(Into::<Convention>::into).collect())
            .map_err(|reason| format!("Conventions after {}, cursor {:?} could not be retrieved. Reason: {}", date, after, reason))
    }

    pub fn count_conventions_after(&self, search: Option<&Search>, date: NaiveDate) -> i64 {
        let conn = self.pool.get().unwrap();
        if let Some(search) = search {
            conventions::table
                .filter(string_score(conventions::title, search.body(), 0.5).gt(0.33))
                .select(dsl::count(conventions::con_id))
                .filter(conventions::start_date.gt(date))
                .first::<i64>(&*conn)
                .unwrap_or(0)
        } else {
            conventions::table
                .select(dsl::count(conventions::con_id))
                .filter(conventions::start_date.gt(date))
                .first::<i64>(&*conn)
                .unwrap_or(0)
        }
    }

    pub fn get_convention_extra_info_for_convention(&self, con_id: i32) -> Result<Vec<ConventionExtraInfo>, String> {
        let conn = self.pool.get().unwrap();
        conventionextrainfo::table
            .filter(conventionextrainfo::con_id.eq(con_id))
            .load::<ConventionExtraInfo>(&*conn)
            .map_err(|reason| format!("Convention extra info for convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }

    pub fn get_convention_user_info_for_convention(&self, con_id: i32) -> Result<Vec<ConventionUserInfo>, String> {
        let conn = self.pool.get().unwrap();
        conventionuserinfo::table
            .left_outer_join(conventioninforatings::table)
            .select((
                conventionuserinfo::con_info_id,
                conventionuserinfo::information,
                dsl::sql::<sql_types::Integer>("SUM(CASE rating WHEN true THEN 1 ELSE 0 END)::INT"),
                dsl::sql::<sql_types::Integer>("SUM(CASE rating WHEN false THEN 1 ELSE 0 END)::INT"),
            ))
            .filter(conventionuserinfo::con_id.eq(con_id))
            .group_by(conventionuserinfo::con_info_id)
            .load::<ConventionUserInfo>(&*conn)
            .map_err(|reason| format!("Convention user info for convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }

    pub fn get_user_vote_for_convention_user_info(&self, maybe_user_id: Option<i32>, con_info_id: i32) -> Result<i32, String> {
        let user_id = self.resolve_user_id_protected(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        conventioninforatings::table
            .select(dsl::sql::<sql_types::Int4>("CASE rating WHEN true THEN 1 WHEN false THEN -1 ELSE 0 END"))
            .filter(conventioninforatings::user_id.eq(user_id))
            .filter(conventioninforatings::con_info_id.eq(con_info_id))
            .first::<i32>(&*conn)
            .or(Ok(0))
    }

    pub fn get_images_for_convention(&self, con_id: i32) -> Result<Vec<ConventionImage>, String> {
        let conn = self.pool.get().unwrap();
        conventionimages::table
            .distinct_on(conventionimages::image_uuid)
            .filter(conventionimages::con_id.eq(con_id))
            .load::<ConventionImage>(&*conn)
            .map_err(|reason| format!("Images for convention with id {} could not be retrieved. Reason: {}", con_id, reason))
    }
}
