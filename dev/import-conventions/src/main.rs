#[macro_use]
extern crate diesel;

use chrono::NaiveDate;
use diesel::{pg::PgConnection, prelude::*, sql_query};
use serde_json::json;
use std::{
    env,
    fs::{self, File},
    io::{self, Write},
};

mod model;
mod schema;
use crate::model::*;
use crate::schema::{conventionextrainfo, conventions};

#[derive(Queryable, Clone, Debug)]
pub struct ConventionModel {
    pub con_id: i32,
    pub title: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub predecessor: Option<i32>,
}

#[derive(Queryable, Clone, Debug)]
pub struct ConventionExtraInfoModel {
    pub con_id: i32,
    pub title: String,
    pub info: Option<serde_json::Value>,
    pub action: Option<String>,
    pub action_text: Option<String>,
}

fn main() -> io::Result<()> {
    dotenv::dotenv().unwrap();
    let save_ids = env::var("SAVE_IDS").map(|s| s == "true").unwrap_or(false);
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be sets");
    let mut connection = PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));

    let export = env::var("DO_EXPORT_INSTEAD")
        .map(|s| s == "true")
        .unwrap_or(false);

    if export {
        fs::create_dir("exported").ok();
        let cons = conventions::table
            .then_order_by(conventions::con_id.asc())
            .load::<ConventionModel>(&mut connection)
            .unwrap();
        for con in cons {
            let extra_info = conventionextrainfo::table
                .filter(conventionextrainfo::con_id.eq(&con.con_id))
                .load::<ConventionExtraInfoModel>(&mut connection)
                .unwrap();
            let value = Convention {
                id: Some(con.con_id),
                title: con.title,
                start_date: con.start_date.to_string().parse().unwrap(),
                end_date: con.end_date.to_string().parse().unwrap(),
                predecessor: con.predecessor,
                tags: extra_info
                    .iter()
                    .find(|info| info.title == "Tags")
                    .map(|info| {
                        serde_json::from_value::<Vec<String>>(info.info.clone().unwrap()).unwrap()
                    }),
                hours: extra_info
                    .iter()
                    .find(|info| info.title == "Hours")
                    .map(|info| {
                        serde_json::from_value::<Vec<(String, String)>>(info.info.clone().unwrap())
                            .unwrap()
                            .into_iter()
                            .map(|(start, end)| Hours {
                                start: start.parse().unwrap(),
                                end: end.parse().unwrap(),
                            })
                            .collect()
                    }),
                website: extra_info
                    .iter()
                    .find(|info| info.title == "Website")
                    .map(|info| Website {
                        title: info.action_text.clone().unwrap(),
                        url: info.action.clone().unwrap(),
                    })
                    .unwrap(),
                address: Address {
                    address: extra_info
                        .iter()
                        .find(|info| info.title == "Address")
                        .map(|info| serde_json::from_value(info.info.clone().unwrap()).unwrap())
                        .unwrap(),
                    city: extra_info
                        .iter()
                        .find(|info| info.title == "City")
                        .map(|info| serde_json::from_value(info.info.clone().unwrap()).unwrap())
                        .unwrap(),
                    country: extra_info
                        .iter()
                        .find(|info| info.title == "Country")
                        .and_then(|info| serde_json::from_value(info.info.clone()?).ok()?)
                        .unwrap_or_default(),
                    coordinates: extra_info
                        .iter()
                        .find(|info| info.title == "Address")
                        .map(|info| {
                            let action = info.action.clone().unwrap();
                            let chars = &action[24..action.len() - 1];
                            let (lat, lon) = chars.split_once(",").unwrap();
                            Coordinates {
                                lat: lat.parse().unwrap(),
                                lon: lon.parse().unwrap(),
                            }
                        })
                        .unwrap(),
                },
            };
            let file_name = format!(
                "{}-{}",
                value.start_date,
                value
                    .title
                    .replace(|ch: char| !ch.is_ascii_alphanumeric(), "_")
            );
            if value.address.country.is_empty() {
                println!("{}", file_name);
            }
            fs::write(
                format!("exported/{}.toml", file_name),
                toml::to_string_pretty(&value).unwrap(),
            )
            .unwrap();
        }
        return Ok(());
    }

    for file_name in env::args().skip(1) {
        let file = fs::read_to_string(&file_name).unwrap();
        let mut convention = toml::from_str::<Convention>(&file).unwrap();
        let id = connection
            .transaction::<i32, diesel::result::Error, _>(|connection| {
                let start_date: NaiveDate = convention.start_date.to_string().parse().unwrap();
                let end_date: NaiveDate = convention.end_date.to_string().parse().unwrap();
                let id: i32 = // insert or update
                    if let Some(con_id) = convention.id {
                        diesel::update(conventions::table)
                            .filter(conventions::con_id.eq(con_id))
                            .set((
                                conventions::title.eq(&convention.title),
                                conventions::start_date.eq(start_date),
                                conventions::end_date.eq(end_date),
                                conventions::predecessor.eq(convention.predecessor)
                            ))
                            .execute(connection)?;
                        con_id
                    } else {
                        diesel::insert_into(conventions::table)
                            .values((
                                conventions::title.eq(&convention.title),
                                conventions::start_date.eq(start_date),
                                conventions::end_date.eq(end_date),
                                conventions::predecessor.eq(convention.predecessor),
                            ))
                            .returning(conventions::con_id)
                            .get_result(connection)?
                    };
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Address"),
                        conventionextrainfo::info.eq(json!(&convention.address.address)),
                        conventionextrainfo::action.eq(format!(
                            "conartist://map?coords=[{},{}]",
                            convention.address.coordinates.lat, convention.address.coordinates.lon
                        )),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set((
                        conventionextrainfo::info.eq(json!(&convention.address.address)),
                        conventionextrainfo::action.eq(format!(
                            "conartist://map?coords=[{},{}]",
                            convention.address.coordinates.lat, convention.address.coordinates.lon
                        )),
                    ))
                    .execute(connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("City"),
                        conventionextrainfo::info.eq(json!(&convention.address.city)),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set(conventionextrainfo::info.eq(json!(&convention.address.city)))
                    .execute(connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Country"),
                        conventionextrainfo::info.eq(json!(&convention.address.country)),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set(conventionextrainfo::info.eq(json!(&convention.address.country)))
                    .execute(connection)?;
                if let Some(ref tags) = convention.tags {
                    diesel::insert_into(conventionextrainfo::table)
                        .values((
                            conventionextrainfo::con_id.eq(id),
                            conventionextrainfo::title.eq("Tags"),
                            conventionextrainfo::info.eq(json!(tags)),
                        ))
                        .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                        .do_update()
                        .set(conventionextrainfo::info.eq(json!(tags)))
                        .execute(connection)?;
                }
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Website"),
                        conventionextrainfo::action_text.eq(&convention.website.title),
                        conventionextrainfo::action.eq(&convention.website.url),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set((
                        conventionextrainfo::action_text.eq(&convention.website.title),
                        conventionextrainfo::action.eq(&convention.website.url),
                    ))
                    .execute(connection)?;
                if let Some(ref hours) = convention.hours {
                    let hours_json = json!(
                        hours
                            .iter()
                            .map(|Hours { start, end }| vec![start.to_string(), end.to_string()])
                            .collect::<Vec<_>>()
                    );
                    diesel::insert_into(conventionextrainfo::table)
                        .values((
                            conventionextrainfo::con_id.eq(id),
                            conventionextrainfo::title.eq("Hours"),
                            conventionextrainfo::info.eq(&hours_json),
                        ))
                        .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                        .do_update()
                        .set(conventionextrainfo::info.eq(&hours_json))
                        .execute(connection)?;
                }
                Ok(id)
            })
            .map_err(|reason| {
                format!(
                    "Failed when attempting to add convention {:?}: {}",
                    convention, reason
                )
            })
            .unwrap();
        if save_ids {
            convention.id = Some(id);
        } else {
            convention.id = None;
        }
        let mut file = File::create(&file_name).unwrap();
        let toml = toml::to_string(&convention).unwrap();
        writeln!(file, "{}", toml).unwrap();
    }
    sql_query("REFRESH MATERIALIZED VIEW ConventionSearch")
        .execute(&mut connection)
        .unwrap();
    Ok(())
}
