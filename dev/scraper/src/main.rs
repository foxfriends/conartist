use std::env;
use std::fs::File;
use std::io::Write;
use lazy_static::lazy_static;
use scraper::{Html, Selector};
use regex::Regex;

mod model;
use crate::model::*;

lazy_static! {
    static ref CONVENTION_SELECTOR: Selector = Selector::parse("#ConListTable tbody tr td a").unwrap();
    static ref TITLE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] meta[itemprop=name]").unwrap();
    static ref START_DATE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] meta[itemprop=startDate]").unwrap();
    static ref END_DATE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] meta[itemprop=endDate]").unwrap();
    static ref VENUE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=name]").unwrap();
    static ref LATITUDE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=latitude]").unwrap();
    static ref LONGITUDE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=longitude]").unwrap();
    static ref LOCALITY_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=addressLocality]").unwrap();
    static ref REGION_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=addressRegion]").unwrap();
    static ref POSTAL_CODE_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=postalCode]").unwrap();
    static ref COUNTRY_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] div[itemprop=location] meta[itemprop=addressCountry]").unwrap();
    static ref URL_SELECTOR: Selector = Selector::parse("div[itemtype='http://schema.org/Event'] + a").unwrap();

    static ref NAME_YEAR_REGEX: Regex = Regex::new(r"^(.*)\s+(\d{4})$").unwrap();
    static ref URL_TITLE_REGEX: Regex = Regex::new(r"^https?://([^/]+)/.*$").unwrap();
}

fn content(document: &Html, selector: &Selector) -> Option<String> {
    Some(document.select(selector).next()?.value().attr("content")?.to_string())
}

fn retrieve_convention(details_url: &reqwest::Url) -> Option<Convention> {
    let mut details_resp = reqwest::get(details_url.clone()).unwrap();
    let details_document = Html::parse_document(&details_resp.text().unwrap());

    let title = NAME_YEAR_REGEX.captures(&content(&details_document, &TITLE_SELECTOR)?)?[1].to_owned();
    let start_date = content(&details_document, &START_DATE_SELECTOR)?.parse().unwrap();
    let end_date = content(&details_document, &END_DATE_SELECTOR)?.parse().unwrap();
    let venue = content(&details_document, &VENUE_SELECTOR)?;
    let latitude = content(&details_document, &LATITUDE_SELECTOR)?.parse().unwrap();
    let longitude = content(&details_document, &LONGITUDE_SELECTOR)?.parse().unwrap();
    let locality = content(&details_document, &LOCALITY_SELECTOR)?;
    let region = content(&details_document, &REGION_SELECTOR)?;
    let postal_code = content(&details_document, &POSTAL_CODE_SELECTOR)?;
    let country = content(&details_document, &COUNTRY_SELECTOR)?;
    let url = details_document.select(&URL_SELECTOR).next()?.value().attr("href")?.to_string();
    let url_title = URL_TITLE_REGEX.captures(&url)?[1].to_string();
    let convention = Convention {
        title,
        start_date,
        end_date,
        predecessor: None,
        hours: None,
        website: Website {
            title: url_title,
            url,
        },
        address: Address {
            city: format!("{}, {}", locality, region),
            address: format!("{}\n{}, {}, {}\n{}", venue, locality, region, country, postal_code),
            coordinates: Coordinates {
                lat: latitude,
                lon: longitude,
            }
        }
    };

    Some(convention)
}

fn main() {
    let mut args = env::args().skip(1);
    let table_url: reqwest::Url = args.next().expect("A URL was not provided").parse().unwrap();
    let output_folder = args.next().expect("An output folder was not provided");
    let mut resp = reqwest::get(table_url.clone()).unwrap();
    let body = resp.text().unwrap();
    let document = Html::parse_document(&body);

    for convention_link in document.select(&CONVENTION_SELECTOR) {
        let details_url = table_url.join(convention_link.value().attr("href").unwrap()).unwrap();
        if let Some(convention) = retrieve_convention(&details_url) {
            let toml = toml::to_string(&convention).unwrap();
            let segments: Vec<_> = details_url.path_segments().unwrap().collect();
            let file_name = format!("{}-{}", segments[segments.len() - 1], segments[segments.len() - 2]);
            let mut file = File::create(format!("./{}/{}.toml", output_folder, file_name)).unwrap();
            writeln!(file, "{}", toml).unwrap();
        } else {
            println!("Failed: {}", details_url);
        }
    }
}
