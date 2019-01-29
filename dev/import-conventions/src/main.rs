#[macro_use] extern crate diesel;

use chrono::NaiveDate;
use std::{fs::{self, File}, io::{self, Write}, env};
use serde_json::json;
use diesel::{prelude::*, pg::PgConnection};

mod schema;
mod model;
use crate::model::*;
use crate::schema::{conventions, conventionextrainfo};

fn main() -> io::Result<()> {
    dotenv::dotenv().unwrap();
    let save_ids = env::var("SAVE_IDS").map(|s| s == "true").unwrap_or(false);
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be sets");
    let connection = PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));
    for file_name in env::args().skip(1) {
        let file = fs::read_to_string(&file_name).unwrap();
        let mut convention = toml::from_str::<Convention>(&file).unwrap();
        let id = connection
            .transaction::<i32, diesel::result::Error, _>(|| {
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
                            .execute(&connection)?;
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
                            .get_result(&connection)?
                    };
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Address"),
                        conventionextrainfo::info.eq(json!(&convention.address.address)),
                        conventionextrainfo::action.eq(format!("conartist://map?coords=[{},{}]", convention.address.coordinates.lat, convention.address.coordinates.lon)),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set((
                        conventionextrainfo::info.eq(json!(&convention.address.address)),
                        conventionextrainfo::action.eq(format!("conartist://map?coords=[{},{}]", convention.address.coordinates.lat, convention.address.coordinates.lon)),
                    ))
                    .execute(&connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("City"),
                        conventionextrainfo::info.eq(json!(&convention.address.city)),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set(conventionextrainfo::info.eq(json!(&convention.address.city)))
                    .execute(&connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Country"),
                        conventionextrainfo::info.eq(json!(&convention.address.country)),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set(conventionextrainfo::info.eq(json!(&convention.address.country)))
                    .execute(&connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Tags"),
                        conventionextrainfo::info.eq(json!(&convention.tags)),
                    ))
                    .on_conflict((conventionextrainfo::con_id, conventionextrainfo::title))
                    .do_update()
                    .set(conventionextrainfo::info.eq(json!(&convention.tags)))
                    .execute(&connection)?;
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
                    .execute(&connection)?;
                if let Some(ref hours) = convention.hours {
                    let hours_json = json!(
                        hours
                            .iter()
                            .map(|Hours { start, end }|
                                vec![start.to_string(), end.to_string()]
                            )
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
                        .execute(&connection)?;
                }
                Ok(id)
            })
            .map_err(|reason| format!("Failed when attempting to add convention {:?}: {}", convention, reason))
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
    Ok(())
}
