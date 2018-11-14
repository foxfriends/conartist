//! A global SystemRandom instance

use chrono::offset::Utc;
use ring::rand::{SystemRandom, SecureRandom};

lazy_static! {
    static ref SYS_RAND: SystemRandom = SystemRandom::new();
}

/// Generates some sort of nonce?
pub fn nonce() -> Result<String, ring::error::Unspecified> {
    let time = Utc::now().timestamp();
    let mut nonce_part: [u8; 10] = [0; 10];
    SYS_RAND.fill(&mut nonce_part)?;

    let mut string = String::with_capacity(32);
    string.push_str(&format!("{:012x}", time));
    for byte in &nonce_part {
        string.push_str(&format!("{:02x}", byte));
    }
    assert_eq!(string.len(), 32);
    Ok(string)
}
