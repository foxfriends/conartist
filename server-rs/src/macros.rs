#[macro_export]
macro_rules! query {
    ($conn:expr, $query:expr) => {
        $conn.query($query, &[]).unwrap()
    };
    ($conn:expr, $query:expr, $($var:expr),* ) => {
        $conn.query($query, &[$(&$var, )*]).unwrap()
    };
}
