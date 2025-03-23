//! SQL DSL extensions
use diesel::sql_types::*;

define_sql_function!(fn unnest(array: Array<Int4>) -> Int4);
define_sql_function!(fn coalesce(x: Nullable<Text>, y: Nullable<Text>) -> Nullable<Text>);
define_sql_function!(fn string_score(original: Text, query: Text, fuzziness: Double) -> Double);
define_sql_function! {
    #[sql_name="string_score"]
    fn string_score_exact(original: Text, query: Text) -> Double
}
