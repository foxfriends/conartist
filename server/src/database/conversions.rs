use crate::money::{Currency, Money};
use diesel::Queryable;
use diesel::deserialize::{self, FromSql};
use diesel::pg::Pg;
use diesel::serialize::{self, IsNull, Output, ToSql};
use diesel::sql_types::Text;
use std::io::Write;
use std::str::FromStr;

impl From<Money> for i64 {
    fn from(val: Money) -> Self {
        val.amt()
    }
}

impl FromSql<Text, Pg> for Money {
    fn from_sql(
        bytes: <Pg as diesel::backend::Backend>::RawValue<'_>,
    ) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        FromStr::from_str(&string)
            .map_err(|_| format!("Could not parse Money from {}", string).into())
    }
}

impl ToSql<Text, Pg> for Money {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        out.write_all(self.to_string().as_bytes())?;
        Ok(IsNull::No)
    }
}

impl Queryable<Text, Pg> for Money {
    type Row = Self;

    fn build(row: Self::Row) -> deserialize::Result<Self> {
        Ok(row)
    }
}

impl FromSql<Text, Pg> for Currency {
    fn from_sql(
        bytes: <Pg as diesel::backend::Backend>::RawValue<'_>,
    ) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        FromStr::from_str(&string)
            .map_err(|_| format!("Could not parse Currency from {}", string).into())
    }
}

impl ToSql<Text, Pg> for Currency {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        out.write_all(self.to_string().as_bytes())?;
        Ok(IsNull::No)
    }
}

impl Queryable<Text, Pg> for Currency {
    type Row = Self;

    fn build(row: Self::Row) -> deserialize::Result<Self> {
        Ok(row)
    }
}
