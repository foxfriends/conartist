//! SQL DSL extensions
use diesel::sql_types::*;

sql_function!(fn unnest(array: Array<Int4>) -> Int4);
sql_function!(fn coalesce(x: Nullable<Text>, y: Nullable<Text>) -> Nullable<Text>);
sql_function!(fn string_score(original: Text, query: Text, fuzziness: Double) -> Double);
sql_function! {
    #[sql_name="string_score"]
    fn string_score_exact(original: Text, query: Text) -> Double
}
