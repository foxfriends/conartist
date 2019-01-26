use std::io::Write;
use diesel::pg::Pg;
use diesel::sql_types::Text;
use diesel::deserialize::{self, FromSql, FromSqlRow};
use diesel::serialize::{self, Output, ToSql};
use diesel::Queryable;
use juniper::{Value, graphql_scalar, ParseScalarValue, ParseScalarResult};
use std::error::Error;
use std::str::FromStr;
use crate::money::{Money, Currency};

graphql_scalar!(Money where Scalar = <S> {
    description: "Represents a monetary value and a currency as a string, such as CAD150 for $1.50 in CAD"

    resolve(&self) -> Value {
        Value::scalar(self.to_string())
    }

    from_input_value(v: &InputValue) -> Option<Money> {
        v   .as_scalar_value::<String>()
            .and_then(|s| FromStr::from_str(&s).ok())
    }

    from_str<'a>(value: ScalarToken<'a>) -> ParseScalarResult<'a, S> {
        <i32 as ParseScalarValue<S>>::from_str(value)
    }
});

impl Into<i64> for Money {
    fn into(self) -> i64 {
        self.amt()
    }
}

impl FromSql<Text, Pg> for Money {
    fn from_sql(bytes: Option<&[u8]>) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        FromStr::from_str(&string).map_err(|_| format!("Could not parse Money from {}", string).into())
    }
}

impl ToSql<Text, Pg> for Money {
    fn to_sql<W: Write>(&self, w: &mut Output<'_, W, Pg>) -> serialize::Result {
        ToSql::<Text, Pg>::to_sql(&self.to_string(), w)
    }
}

impl FromSqlRow<Text, Pg> for Money {
    fn build_from_row<R: ::diesel::row::Row<Pg>>(row: &mut R) -> Result<Self, Box<dyn Error+Send+Sync>> {
        FromSql::<Text, Pg>::from_sql(row.take())
    }
}

impl Queryable<Text, Pg> for Money {
    type Row = Self;
    fn build(row: Self) -> Self {
        row
    }
}

graphql_scalar!(Currency where Scalar = <S> {
    description: "Represents a type of currency"

    resolve(&self) -> Value {
        Value::scalar(self.to_string())
    }

    from_input_value(v: &InputValue) -> Option<Currency> {
        v   .as_scalar_value::<String>()
            .and_then(|s| FromStr::from_str(&s).ok())
    }

    from_str<'a>(value: ScalarToken<'a>) -> ParseScalarResult<'a, S> {
        <i32 as ParseScalarValue<S>>::from_str(value)
    }
});

impl FromSql<Text, Pg> for Currency {
    fn from_sql(bytes: Option<&[u8]>) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        FromStr::from_str(&string).map_err(|_| format!("Could not parse Currency from {}", string).into())
    }
}

impl ToSql<Text, Pg> for Currency {
    fn to_sql<W: Write>(&self, w: &mut Output<'_, W, Pg>) -> serialize::Result {
        ToSql::<Text, Pg>::to_sql(&self.to_string(), w)
    }
}

impl FromSqlRow<Text, Pg> for Currency {
    fn build_from_row<R: ::diesel::row::Row<Pg>>(row: &mut R) -> Result<Self, Box<dyn Error+Send+Sync>> {
        FromSql::<Text, Pg>::from_sql(row.take())
    }
}

impl Queryable<Text, Pg> for Currency {
    type Row = Self;
    fn build(row: Self) -> Self {
        row
    }
}
