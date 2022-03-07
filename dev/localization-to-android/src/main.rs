use std::io::{self, stdin, Read};
use toml::Value;
use treexml::{Document, ElementBuilder as E};

fn sanitize(name: &str) -> String {
    name.replace(|char| "{}<> '\",.!?:-\\/&()".contains(char), "_")
}

fn encode(string: &str) -> String {
    let mut string = string
        .replace("'", "\\'")
        .replace("\"", "\\\"")
        .replace("?", "\\?")
        .replace("@", "\\@");
    let mut index = 1;
    while string.contains("{}") {
        string = string.replacen("{}", &format!("%{}$s", index), 1);
        index += 1;
    }
    string
}

fn main() -> io::Result<()> {
    let mut contents = String::new();
    stdin().read_to_string(&mut contents)?;
    let toml_document = toml::from_str::<toml::Value>(&contents).unwrap();
    let table = toml_document.as_table().unwrap();
    let mut children: Vec<_> = table
        .into_iter()
        .map(|(name, value)| (sanitize(name), value))
        .map(|(name, value)| {
            let string = match value {
                Value::Table(table) => table.get("android").unwrap().as_str().unwrap(),
                Value::String(string) => string,
                _ => panic!("Invalid data"),
            };
            (name, encode(string))
        })
        .map(|(name, string)| E::new("string").attr("name", name).text(string).clone())
        .collect();

    let document = Document::build(E::new("resources").children(children.iter_mut().collect()));
    println!("{}", document);
    Ok(())
}
