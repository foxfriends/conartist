//! The Conventions table, and the join of Conventions and all of the user's data
#![allow(dead_code)]
use chrono::{NaiveDate, NaiveDateTime};
use serde_json;

#[derive(Queryable, Clone)]
pub struct ConventionExtraInfo {
    pub con_id: i32,
    pub title: String,
    pub info: Option<serde_json::Value>,
    pub action: Option<String>,
    pub action_text: Option<String>,
}

#[derive(Queryable, Clone)]
pub struct ConventionUserInfo {
    pub con_info_id: i32,
    pub con_id: i32,
    pub user_id: i32,
    pub information: String,
}

#[derive(Queryable, Clone)]
pub struct ConventionInfoRating {
    pub con_info_id: i32,
    pub user_id: i32,
    pub rating: bool,
}

#[derive(Queryable, Clone)]
pub struct Convention {
    pub con_id: i32,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub extra_info: Vec<ConventionExtraInfo>,
}

#[derive(Queryable, Clone)]
pub struct ConventionImage {
    pub image_id: i32,
    pub con_id: i32,
    pub image_uuid: String,
    pub create_date: NaiveDateTime,
}

#[derive(Queryable, Clone)]
pub struct UserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
}
