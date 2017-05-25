'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Papa from 'papaparse';
import * as Storage from '@google-cloud/storage';
import { ProductTypes, Products, Prices, Record } from './src/types';

let storage: Storage.Storage, bucket: Storage.Bucket;
if(process.env.GCLOUD_STORAGE_BUCKET) {
  // HACK: some workarounds for bad typescript yay!
  storage = (Storage as any)();
  bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
} else if(process.argv[2] === 'remote') {
  storage = (Storage as any)({
    projectId: 'conartist-168422',
    keyFilename: './ConArtist-f4cb1e1f299c.json',
  });
  bucket = storage.bucket('conartist');
}

async function readdir(dir: string): Promise<string[]> {
  if(storage && bucket) {
    const [ files ] = await bucket.getFiles({ prefix: 'data/' });
    return files.map((file: Storage.File) => file.name);
  } else {
    return await new Promise<string[]>((resolve, reject) => fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files.map(_ => `${dir}/${_}`))));
  }
}

async function readFile(file: string): Promise<string> {
  if(storage && bucket) {
    const blob = bucket.file(file);
    if((await blob.exists())[0]) {
      const [data] = await blob.download();
      return data.toString();
    } else {
      return '';
    }
  } else {
    return await new Promise<string>((resolve, reject) => fs.readFile(file, (err, data) => err ? reject(err) : resolve(data.toString())));
  }
}

function writeFile(file: string, data: string, options?: Storage.WriteStreamOptions): Promise<void> {
  if(storage && bucket) {
    const blob = bucket.file(file);
    return blob.save(data, options);
  } else {
    return new Promise<void>((resolve, reject) => fs.writeFile(file, data, (err) => err ? reject(err) : resolve()));
  }
}

const app = express();
app.listen(process.env.PORT || 8080, () => {
  // tslint:disable-next-line
  console.log('Server is listening on port 8080');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/dashboard/products', async (__, res) => {
  const files = (await readdir('data')).filter(_ => path.extname(_) === '.csv');
  const products: Products = {};
  await Promise.all(files.map(async file => {
    const { data }: { data: String[] } = Papa.parse((await readFile(file)).trim());
    const filename = path.basename(file, '.csv');
    if(filename !== 'records' && filename !== 'prices') {
      if(data[0].length === 2) {
        // simple files
        data.forEach(([name,quantity]) => {
          const type = path.basename(file, '.csv') as keyof ProductTypes;
          products[type] = products[type] || [];
          products[type]!.push([name, +quantity]);
        });
      } else {
        // exported files
        data.slice(1).forEach(([name,,quantity]) => {
          const type = path.basename(file, '.csv') as keyof ProductTypes;
          products[type] = products[type] || [];
          products[type]!.push([name, +quantity]);
        });
      }
    }
  }));
  res.header('Content-Type: application/json');
  res.send(JSON.stringify(products));
});

app.get('/app/products/:con/', async (__, res) => {
  // TODO: organize by convention
  // const con: string = req.params.con;
  const files = (await readdir('data')).filter(_ => path.extname(_) === '.csv');
  const response = {
    products: {} as Products,
    prices: {} as Prices,
    records: [] as Record[],
  };
  await Promise.all(files.map(async file => {
    const { data }: { data: String[] } = Papa.parse((await readFile(file)).trim());
    switch(path.basename(file, '.csv')) {
      case 'records':
        response.records.push(...data.map(([type,quantity,names,price,time]) => ({
            type,
            quantity: +quantity,
            products: names.split(';'),
            price: +price,
            time: +time,
          } as Record)).sort((a, b) => a.time - b.time));
        break;
      case 'prices':
        data.forEach(([type, quantity, price]) => {
          response.prices[type] = response.prices[type] || [];
          response.prices[type].push([+quantity, +price]);
        });
        break;
      default:
        if(data.length === 0) { break; }
        if(data[0].length === 2) {
          // simple files
          data.forEach(([name,quantity]) => {
            const type = path.basename(file, '.csv') as keyof ProductTypes;
            response.products[type] = response.products[type] || [];
            response.products[type]!.push([name, +quantity]);
          });
        } else {
          // exported files
          data.slice(1).forEach(([name,,quantity]) => {
            const type = path.basename(file, '.csv') as keyof ProductTypes;
            response.products[type] = response.products[type] || [];
            response.products[type]!.push([name, +quantity]);
          });
        }
    }
  }));
  res.header('Content-Type: application/json');
  res.send(JSON.stringify(response));
});
app.put('/app/purchase/:con', async (req, res) => {
  // TODO: organize by convention
  // const con: string = req.params.con;
  const record = {
    type: req.body.type,
    quantity: +req.body.quantity,
    products: req.body.products.split(','),
    price: +req.body.price,
    time: +req.body.time,
  } as Record;
  await queueSave(record);
  res.header('Content-Type: text/plain');
  res.send('Success');
});
app.use('/', express.static('public_html'));

const recordFile = 'data/records.csv';
let queue: Promise<void> = Promise.resolve();
function queueSave(record: Record): Promise<void> {
  return queue = queue.then(async () => {
    let records = await readFile(recordFile);
    records += `${record.type},${record.quantity},${record.products.join(';')},${record.price},${record.time}\n`;
    await writeFile(recordFile, records, { metadata: { contentType: 'text/csv' }});
  });
}
