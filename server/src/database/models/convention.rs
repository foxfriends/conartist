//! The Conventions table, and the join of Conventions and all of the user's data

use chrono::{NaiveDate, NaiveDateTime};
use diesel::Queryable;
use serde_json::Value;

#[derive(Queryable, Clone, Debug)]
pub struct ConventionExtraInfo {
    pub con_id: i32,
    pub title: String,
    pub info: Option<Value>,
    pub action: Option<String>,
    pub action_text: Option<String>,
}

#[derive(Queryable, Clone, Debug)]
pub struct RawConventionUserInfo {
    pub con_info_id: i32,
    pub con_id: i32,
    pub user_id: i32,
    pub information: String,
}

impl From<RawConventionUserInfo> for ConventionUserInfo {
    fn from(val: RawConventionUserInfo) -> Self {
        ConventionUserInfo {
            con_info_id: val.con_info_id,
            information: val.information,
            upvotes: 0i32,
            downvotes: 0i32,
        }
    }
}

#[derive(Queryable, Clone, Debug)]
pub struct ConventionUserInfo {
    pub con_info_id: i32,
    pub information: String,
    pub upvotes: i32,
    pub downvotes: i32,
}

#[derive(Queryable, Clone, Debug)]
pub struct ConventionInfoRating {
    pub con_info_id: i32,
    pub user_id: i32,
    pub rating: bool,
}

#[derive(Queryable, Clone, Debug)]
pub struct Convention {
    pub con_id: i32,
    pub user_id: Option<i32>,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub predecessor: Option<i32>,
}

#[derive(Queryable, Clone, Debug)]
pub struct DetachedConvention {
    pub con_id: i32,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub predecessor: Option<i32>,
}

impl DetachedConvention {
    pub fn attached_to(self, user_id: i32) -> Convention {
        Convention {
            con_id: self.con_id,
            user_id: Some(user_id),
            title: self.title,
            start_date: self.start_date,
            end_date: self.end_date,
            predecessor: self.predecessor,
        }
    }
}

impl From<DetachedConvention> for Convention {
    fn from(val: DetachedConvention) -> Self {
        Convention {
            con_id: val.con_id,
            user_id: None,
            title: val.title,
            start_date: val.start_date,
            end_date: val.end_date,
            predecessor: val.predecessor,
        }
    }
}

#[derive(Queryable, Clone, Debug)]
pub struct ConventionImage {
    pub image_id: i32,
    pub con_id: i32,
    pub image_uuid: String,
    pub create_date: NaiveDateTime,
}

#[derive(Queryable, Clone, Debug)]
pub struct UserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
}
