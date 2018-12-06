//! The Conventions table, and the join of Conventions and all of the user's data
// #![allow(dead_code)]

use chrono::{NaiveDate, NaiveDateTime};
use serde_json::Value;
use diesel::Queryable;

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

impl Into<ConventionUserInfo> for RawConventionUserInfo {
    fn into(self) -> ConventionUserInfo {
        ConventionUserInfo {
            con_info_id: self.con_info_id,
            information: self.information,
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

impl Into<Convention> for DetachedConvention {
    fn into(self) -> Convention {
        Convention {
            con_id: self.con_id,
            user_id: None,
            title: self.title,
            start_date: self.start_date,
            end_date: self.end_date,
            predecessor: self.predecessor,
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
