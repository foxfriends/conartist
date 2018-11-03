use chrono::{DateTime, FixedOffset};
use diesel::pg::Pg;
use diesel::sql_types::Text;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::serialize::{self, Output, ToSql};
use diesel::Queryable;
use std::io::Write;
use std::error::Error;

#[derive(Copy, Clone, Debug)]
pub struct Time(pub DateTime<FixedOffset>);

impl FromSql<Text, Pg> for Time {
    fn from_sql(bytes: Option<&[u8]>) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        Ok(Time(DateTime::parse_from_rfc3339(&string)?))
    }
}

impl ToSql<Text, Pg> for Time {
    fn to_sql<W: Write>(&self, w: &mut Output<W, Pg>) -> serialize::Result {
        ToSql::<Text, Pg>::to_sql(&self.0.to_rfc3339(), w)
    }
}

impl FromSqlRow<Text, Pg> for Time {
    fn build_from_row<R: ::diesel::row::Row<Pg>>(row: &mut R) -> Result<Self, Box<dyn Error+Send+Sync>> {
        FromSql::<Text, Pg>::from_sql(row.take())
    }
}

impl Queryable<Text, Pg> for Time {
    type Row = Self;
    fn build(row: Self) -> Self {
        row
    }
}
