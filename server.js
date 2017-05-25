'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const Papa = require("papaparse");
const Storage = require("@google-cloud/storage");
let storage, bucket;
if (process.env.GCLOUD_STORAGE_BUCKET) {
    storage = Storage();
    bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
}
else if (process.argv[2] === 'remote') {
    storage = Storage({
        projectId: 'conartist-168422',
        keyFilename: './ConArtist-f4cb1e1f299c.json',
    });
    bucket = storage.bucket('conartist');
}
function readdir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (storage && bucket) {
            const [files] = yield bucket.getFiles({ prefix: 'data/' });
            return files.map((file) => file.name);
        }
        else {
            return yield new Promise((resolve, reject) => fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files.map(_ => `${dir}/${_}`))));
        }
    });
}
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (storage && bucket) {
            const blob = bucket.file(file);
            if ((yield blob.exists())[0]) {
                const [data] = yield blob.download();
                return data.toString();
            }
            else {
                return '';
            }
        }
        else {
            return yield new Promise((resolve, reject) => fs.readFile(file, (err, data) => err ? reject(err) : resolve(data.toString())));
        }
    });
}
function writeFile(file, data, options) {
    if (storage && bucket) {
        const blob = bucket.file(file);
        return blob.save(data, options);
    }
    else {
        return new Promise((resolve, reject) => fs.writeFile(file, data, (err) => err ? reject(err) : resolve()));
    }
}
const app = express();
app.listen(process.env.PORT || 8080, () => {
    console.log('Server is listening on port 8080');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/dashboard/products', (__, res) => __awaiter(this, void 0, void 0, function* () {
    const files = (yield readdir('data')).filter(_ => path.extname(_) === '.csv');
    const products = {};
    yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
        const { data } = Papa.parse((yield readFile(file)).trim());
        const filename = path.basename(file, '.csv');
        if (filename !== 'records' && filename !== 'prices') {
            if (data[0].length === 2) {
                data.forEach(([name, quantity]) => {
                    const type = path.basename(file, '.csv');
                    products[type] = products[type] || [];
                    products[type].push([name, +quantity]);
                });
            }
            else {
                data.slice(1).forEach(([name, , quantity]) => {
                    const type = path.basename(file, '.csv');
                    products[type] = products[type] || [];
                    products[type].push([name, +quantity]);
                });
            }
        }
    })));
    res.header('Content-Type: application/json');
    res.send(JSON.stringify(products));
}));
app.get('/app/products/:con/', (__, res) => __awaiter(this, void 0, void 0, function* () {
    const files = (yield readdir('data')).filter(_ => path.extname(_) === '.csv');
    const response = {
        products: {},
        prices: {},
        records: [],
    };
    yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
        const { data } = Papa.parse((yield readFile(file)).trim());
        switch (path.basename(file, '.csv')) {
            case 'records':
                response.records.push(...data.map(([type, quantity, names, price, time]) => ({
                    type,
                    quantity: +quantity,
                    products: names.split(';'),
                    price: +price,
                    time: +time,
                })).sort((a, b) => a.time - b.time));
                break;
            case 'prices':
                data.forEach(([type, quantity, price]) => {
                    response.prices[type] = response.prices[type] || [];
                    response.prices[type].push([+quantity, +price]);
                });
                break;
            default:
                if (data.length === 0) {
                    break;
                }
                if (data[0].length === 2) {
                    data.forEach(([name, quantity]) => {
                        const type = path.basename(file, '.csv');
                        response.products[type] = response.products[type] || [];
                        response.products[type].push([name, +quantity]);
                    });
                }
                else {
                    data.slice(1).forEach(([name, , quantity]) => {
                        const type = path.basename(file, '.csv');
                        response.products[type] = response.products[type] || [];
                        response.products[type].push([name, +quantity]);
                    });
                }
        }
    })));
    res.header('Content-Type: application/json');
    res.send(JSON.stringify(response));
}));
app.put('/app/purchase/:con', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const record = {
        type: req.body.type,
        quantity: +req.body.quantity,
        products: req.body.products.split(','),
        price: +req.body.price,
        time: +req.body.time,
    };
    yield queueSave(record);
    res.header('Content-Type: text/plain');
    res.send('Success');
}));
app.use('/', express.static('public_html'));
const recordFile = 'data/records.csv';
let queue = Promise.resolve();
function queueSave(record) {
    return queue = queue.then(() => __awaiter(this, void 0, void 0, function* () {
        let records = yield readFile(recordFile);
        records += `${record.type},${record.quantity},${record.products.join(';')},${record.price},${record.time}\n`;
        yield writeFile(recordFile, records, { metadata: { contentType: 'text/csv' } });
    }));
}
