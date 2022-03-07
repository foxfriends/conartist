use std::collections::HashMap;

#[derive(Clone, Debug)]
pub struct Search {
    body: String,
    fields: HashMap<String, String>,
}

/// Represents a search query, which can be parsed from the search query format:
///
/// *   Body goes to default search: comiccon
/// *   Specified fields for searching specific attributes: {country:canada}
/// *   Combination of both: comiccon {country:canada}
/// *   Multiple fields: comiccon {country:canada} {city:ottawa}
///
/// Note that the order of fields does not matter. Neither does the position of fields within the
/// search query - all body text will be concatenated. Repeated fields will be ignored, keeping
/// only the last occurrence of that field.
///
/// Eventually it may be worthwhile to invest in a proper search engine type thing, but for now
/// the clients can pass strings in this format which can then be handled in any way by the
/// searchable field.
impl Search {
    /// Parses a string into a query object
    pub fn parse_query<S: AsRef<str>>(raw: S) -> Search {
        enum State {
            Body,
            FieldName(String),
            FieldValue(String, String),
        }

        let mut state = State::Body;
        let mut body = String::new();
        let mut fields = HashMap::new();

        // this parse is far from fast, with lots of string copying, but search queries are
        // expected to be relatively short. Search length should be restricted at the entry point.
        for ch in raw.as_ref().chars() {
            match state {
                State::Body if ch == '{' => state = State::FieldName(String::new()),
                State::Body => body.push(ch),
                State::FieldName(ref key) if ch == ':' => {
                    state = State::FieldValue(key.to_owned(), String::new())
                }
                State::FieldName(ref mut key) => key.push(ch),
                State::FieldValue(ref key, ref value) if ch == '}' => {
                    fields.insert(key.to_lowercase(), value.to_string());
                    state = State::Body;
                }
                State::FieldValue(_, ref mut value) => value.push(ch),
            }
        }

        // have to do some clean up in the end cases
        match state {
            State::Body => {}
            // if there was an incomplete name, pretend it doesn't exist
            State::FieldName(ref key) => {
                body.push('{');
                body.push_str(key)
            }
            // if there is an unclosed value, automaticaly close it
            State::FieldValue(key, value) => {
                fields.insert(key.to_lowercase(), value);
            }
        }

        Search { body, fields }
    }

    /// The search query body
    pub fn body(&self) -> &str {
        &self.body
    }

    /// Retrieve the value for a named field
    pub fn value<S: AsRef<str>>(&self, key: S) -> Option<&String> {
        self.fields.get(&key.as_ref().to_lowercase())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_body() {
        let query = "comiccon";
        let search = Search::parse_query(query);
        assert_eq!(search.body(), String::from("comiccon"));
    }

    #[test]
    fn parse_field() {
        let query = "comiccon{country:canada}";
        let search = Search::parse_query(query);
        assert_eq!(&search.body(), &"comiccon");
        assert_eq!(search.value("country"), Some(&String::from("canada")));
    }
}
