//! The Conventions table, and the join of Conventions and all of the user's data
#![allow(dead_code)]
use std::panic::catch_unwind;
use postgres::rows::Row;
use chrono::NaiveDate;
use serde_json;

#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConventionExtraInfo {
    pub title: String,
    pub info: Option<String>,
    pub action: Option<String>,
    pub action_text: Option<String>,
}

pub struct ConventionUserInfo {
    pub con_info_id: i32,
    pub info: String,
    pub upvotes: i32,
    pub downvotes: i32,
}

impl ConventionUserInfo {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                con_info_id: row.get("con_info_id"),
                info: row.get("information"),
                upvotes: row.get("upvotes"),
                downvotes: row.get("downvotes"),
            }
        }).map_err(|_| "Tried to create a ConventionUserInfo from a non-ConventionInfo row".to_string())
    }
}

#[derive(Clone)]
pub struct Convention {
    pub con_id: i32,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub extra_info: Vec<ConventionExtraInfo>,
}

impl Convention {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                con_id: row.get("con_id"),
                title: row.get("title"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
                extra_info: serde_json::from_value(row.get::<&'static str, serde_json::Value>("extra_info")).unwrap(),
            }
        }).map_err(|_| "Tried to create a Convention from a non-Convention row".to_string())
    }
}

#[derive(Clone)]
pub struct FullUserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub extra_info: Vec<ConventionExtraInfo>,
}

impl FullUserConvention {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            FullUserConvention {
                user_con_id: row.get("user_con_id"),
                user_id: row.get("user_id"),
                con_id: row.get("con_id"),
                title: row.get("title"),
                start_date: row.get("start_date"),
                end_date: row.get("end_date"),
                extra_info: serde_json::from_value(row.get::<&'static str, serde_json::Value>("extra_info")).unwrap(),
            }
        }).map_err(|_| "Tried to create a FullUserConvention from a non-FullUserConvention row".to_string())
    }
}

#[derive(Clone, Copy)]
pub struct UserConvention {
    pub user_con_id: i32,
    pub user_id: i32,
    pub con_id: i32,
}

impl UserConvention {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                user_con_id: row.get("user_con_id"),
                user_id: row.get("user_id"),
                con_id: row.get("con_id"),
            }
        }).map_err(|_| "Tried to create a UserConvention from a non-UserConvention row".to_string())
    }

    pub fn filled_with(self, con: Convention) -> FullUserConvention {
        FullUserConvention {
            user_con_id: self.user_con_id,
            user_id: self.user_id,
            con_id: self.con_id,
            title: con.title,
            start_date: con.start_date,
            end_date: con.end_date,
            extra_info: con.extra_info,
        }
    }
}