const csv = require('csv');
const toml = require('toml-js');
const fs = require('fs')

const short = {
  Alberta: 'AB',
  BC: 'BC',
  Ontario: 'ON',
  Manitoba: 'MB',
  Saskatchewan: 'SK',
  Quebec: 'QC',
  Newfoundland: 'NL',
  PEI: 'PEI',
  Yukon: 'YT',
  'Nova Scotia': 'NS',
  'New Brunswick': 'NB',
}

const title = website => website
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/$/, '');

const conventions = fs.readFileSync('./conventions.csv');
csv.parse(conventions, (err, rows) => {
  for (const row of rows.slice(1)) {
    const [name, city, province, month, days, website, price, attendance, note, started] = row;
    const con = {
      title: name,
      address: {
        city: `${city}, ${short[province]}`,
      },
      website: {
        title: title(website),
        url: website,
      },
    };
    const str = toml.dump(con);
    fs.writeFileSync(name + '.toml', str);
  }
});
