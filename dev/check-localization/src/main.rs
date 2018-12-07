use std::collections::{BTreeMap, BTreeSet};
use std::{fs, io};

fn main() -> io::Result<()> {
    let mut all_files: BTreeSet<String> = BTreeSet::new();
    let mut discovered_keys: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    let keysets = fs::read_dir("../../shared/localization")?
        .map(|e| e.unwrap())
        .filter(|e| e.file_type().unwrap().is_file())
        .map(|e| (e.file_name(), e.path()))
        .map(|(name, path)| (name, fs::read_to_string(path).unwrap()))
        .map(|(name, contents)| (name, toml::from_str::<toml::Value>(&contents).unwrap()))
        .map(|(name, value)| (name, value.as_table().unwrap().clone()))
        .map(|(name, table)| (name, table.keys().cloned().collect::<Vec<_>>()));

    for (name, keys) in keysets {
        let name = name.to_str().unwrap();
        all_files.insert(name.to_owned());
        for key in keys {
            discovered_keys.entry(key).or_insert(BTreeSet::default()).insert(name.to_owned());
        }
    }

    for (key, files) in discovered_keys {
        if files.len() != all_files.len() {
            println!("\"{}\" missing from languages: {}", key, all_files.difference(&files).cloned().collect::<String>());
        }
    }

    Ok(())
}
