#[macro_use] extern crate diesel;

use serde_derive::Deserialize;
use chrono::{NaiveDate, DateTime, FixedOffset};
use std::{fs, io, env};
use serde_json::json;
use diesel::{prelude::*, pg::PgConnection};

mod schema;
use crate::schema::{conventions, conventionextrainfo};

#[derive(Deserialize, Debug)]
struct Hours {
    pub start: toml::value::Datetime,
    pub end: toml::value::Datetime,
}

#[derive(Deserialize, Debug)]
struct Website {
    pub title: String,
    pub url: String,
}

#[derive(Deserialize, Debug)]
struct Coordinates {
    pub lat: f32,
    pub lon: f32,
}

#[derive(Deserialize, Debug)]
struct Address {
    pub address: String,
    pub city: String,
    pub coordinates: Coordinates,
}

#[derive(Deserialize, Debug)]
struct Convention {
    pub title: String,
    pub start_date: toml::value::Datetime,
    pub end_date: toml::value::Datetime,
    pub predecessor: Option<i32>,
    pub hours: Vec<Hours>,
    pub website: Website,
    pub address: Address,
}

fn main() -> io::Result<()> {
    dotenv::dotenv().unwrap();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be sets");
    let connection = PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));
    for file_name in env::args().skip(1) {
        let file = fs::read_to_string(file_name).unwrap();
        let convention = toml::from_str::<Convention>(&file).unwrap();
        connection
            .transaction::<(), diesel::result::Error, _>(|| {
                let start_date: NaiveDate = convention.start_date.to_string().parse().unwrap();
                let end_date: NaiveDate = convention.end_date.to_string().parse().unwrap();

                let id: i32 = diesel::insert_into(conventions::table)
                    .values((
                        conventions::title.eq(&convention.title),
                        conventions::start_date.eq(start_date),
                        conventions::end_date.eq(end_date),
                        conventions::predecessor.eq(convention.predecessor),
                    ))
                    .returning(conventions::con_id)
                    .get_result(&connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Address"),
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
                    .execute(&connection)?;
                diesel::insert_into(conventionextrainfo::table)
                    .values((
                        conventionextrainfo::con_id.eq(id),
                        conventionextrainfo::title.eq("Website"),
                        conventionextrainfo::action_text.eq(&convention.website.title),
                        conventionextrainfo::action.eq(&convention.website.url),
                    ))
                    .execute(&connection)?;
                let hours_json = json!(
                    convention.hours
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
                        conventionextrainfo::info.eq(hours_json),
                    ))
                    .execute(&connection)?;
                Ok(())
            })
            .map_err(|reason| format!("Failed when attempting to add convention {:?}: {}", convention, reason))
            .unwrap();
    }
    Ok(())
}
