'use strict';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as bodyParser from 'body-parser';
import { ProductTypes, Products, Prices, Record } from './src/types';

function readdir(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files)));
}

function readFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => fs.readFile(file, (err, data) => err ? reject(err) : resolve(data.toString())));
}

function writeFile(file: string, data: string): Promise<{}> {
  return new Promise((resolve, reject) => fs.writeFile(file, data, (err) => err ? reject(err) : resolve()));
}

const app = express();
app.listen(process.env.port || 8000, () => {
  console.log('Server is listening on port 8000');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/products', async (_, res) => {
  const data: string[][][] =
    (await Promise.all(
      (await readdir('./data')).map(file => readFile(path.resolve('data', file)))
    ))
    .map(file => file.trim())
    .map(file => Papa.parse(file))
    .map(_ => _.data);
  const response = {
    products: {} as Products,
    prices: {} as Prices,
    records: [] as Record[]
  };
  for(let set of data) {
    switch(set[0].length) {
      case 2: // product
        const type: keyof ProductTypes = set[0][0] as keyof ProductTypes;
        response.products[type] = set.slice(1).map(([a, b]): [string, number] => [a, +b]);
        break;
      case 3: // price
        for(let [type, qty, price] of set.slice(1)) {
          response.prices[type as keyof ProductTypes] = response.prices[type as keyof ProductTypes] || [];
          response.prices[type as keyof ProductTypes].push([+qty, +price]);
        }
        break;
      case 5: // record
        response.records = set.slice(1).map(([type, quantity, products, price, time]): Record => ({
          type: type as keyof ProductTypes,
          quantity: +quantity,
          products: products.split(';'),
          price: +price,
          time: +time
        }));
        break;
    }
  }
  res.header('Content-Type: application/json');
  res.send(JSON.stringify(response));
});
app.put('/purchase', async (req, res) => {
  // TODO: make this atomic or whatever
  const record = {
    type: req.body.type,
    quantity: +req.body.quantity,
    products: req.body.products.split(','),
    price: +req.body.price,
    time: +req.body.time
  } as Record;

  queueSave(record);

  res.header('Content-Type: text/plain');
  res.send('Success');
});
app.use('/', express.static('public_html'));

let toSave: Record[] = [];
let done: Promise<void> = Promise.resolve();
function queueSave(record: Record): void {
  toSave.push(record);
  done = done.then(async () => {
    const recordFile = path.resolve('data', 'records.csv');
    let records = await readFile(recordFile);
    records += `${record.type},${record.quantity},${record.products.join(';')},${record.price},${record.time}\n`;
    await writeFile(recordFile, records);
  });
}
