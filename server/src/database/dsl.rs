//! SQL DSL extensions
use diesel::sql_types::*;

sql_function!(unnest, SQLUnnestT, (array: Array<Int4>) -> Int4);
