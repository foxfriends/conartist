//! SQL DSL extensions
use diesel::sql_types::*;

sql_function!(unnest, SQLUnnestT, (array: Array<Int4>) -> Int4);
sql_function!(coalesce, Coalesce, (x: Nullable<Text>, y: Nullable<Text>) -> Nullable<Text>);
