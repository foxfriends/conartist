use chrono::{DateTime, FixedOffset};
use diesel::Queryable;
use diesel::deserialize::{self, FromSql};
use diesel::pg::Pg;
use diesel::serialize::{self, Output, ToSql};
use diesel::sql_types::Text;

use std::io::Write;

#[derive(Copy, Clone, Debug)]
pub struct Time(pub DateTime<FixedOffset>);

impl FromSql<Text, Pg> for Time {
    fn from_sql(
        bytes: <Pg as diesel::backend::Backend>::RawValue<'_>,
    ) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        Ok(Time(DateTime::parse_from_rfc3339(&string)?))
    }
}

impl ToSql<Text, Pg> for Time {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        out.write_all(self.0.to_rfc3339().as_bytes())?;
        Ok(serialize::IsNull::No)
    }
}

impl Queryable<Text, Pg> for Time {
    type Row = Self;

    fn build(row: Self::Row) -> deserialize::Result<Self> {
        Ok(row)
    }
}
