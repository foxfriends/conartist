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
const pg = require("pg");
const sql_template_strings_1 = require("sql-template-strings");
const config = {
    user: process.env.CONARTISTPGUSER || 'conartist_app',
    database: process.env.CONARTISTDB || 'conartist',
    password: process.env.CONARTISTPASSWORD || 'temporary-password',
    host: 'localhost',
    min: 1,
    max: process.env.CONARTISTDBPOOL || 10,
    idleTimeoutMillis: process.env.CONARTISTDBTIMEOUT || 1000 * 60,
};
const pool = new pg.Pool(config);
class DBError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Database Error';
    }
}
function connect() {
    return pool.connect();
}
function getCon(user_id, con_code, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows: raw_con } = yield client.query(sql_template_strings_1.default `SELECT * FROM Conventions WHERE con_code = ${con_code}`);
        if (!raw_con.length) {
            throw new DBError(`No con "${con_code}" exists`);
        }
        const [{ con_id }] = raw_con;
        const { rows: raw_user_con } = yield client.query(sql_template_strings_1.default `SELECT * FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`);
        if (!raw_user_con.length) {
            throw new DBError(`Not registered for con ${raw_con[0].title}`);
        }
        return [raw_con[0], raw_user_con[0]];
    });
}
function getConInfo(user_id, con_code) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const [raw_con, { user_con_id }] = yield getCon(user_id, con_code, client);
            const { rows: raw_types } = yield client.query(sql_template_strings_1.default `SELECT type_id, name, color FROM ProductTypes WHERE user_id = ${user_id}`);
            const { rows: raw_products } = yield client.query(sql_template_strings_1.default `SELECT product_id, type_id, name FROM Products WHERE user_id = ${user_id}`);
            const { rows: raw_inventory } = yield client.query(sql_template_strings_1.default `SELECT product_id, quantity FROM Inventory WHERE user_con_id = ${user_con_id}`);
            const { rows: raw_prices } = yield client.query(sql_template_strings_1.default `SELECT type_id, product_id, prices FROM Prices WHERE user_con_id = ${user_con_id}`);
            const { rows: raw_records } = yield client.query(sql_template_strings_1.default `SELECT products, price, sale_time FROM Records WHERE user_con_id = ${user_con_id}`);
            const types = raw_types
                .reduce((_, { type_id, name, color }) => (Object.assign({}, _, { [type_id]: { name, color } })), {});
            const colors = raw_types
                .reduce((_, { name, color }) => (Object.assign({}, _, { [name]: color })), {});
            const products_by_id = raw_products
                .reduce((_, { product_id, type_id, name }) => (Object.assign({}, _, { [product_id]: {
                    name,
                    type: types[type_id].name,
                } })), {});
            const products = raw_inventory
                .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
                .reduce((_, { product: { type, name }, quantity }) => (Object.assign({}, _, { [type]: [
                    ...(_[type] || []),
                    [name, quantity],
                ] })), {});
            const prices = raw_prices
                .reduce((_, { type_id, product_id, prices }) => (Object.assign({}, _, { [`${types[type_id]}${product_id ? `.${products_by_id[product_id].name}` : ''}`]: prices })), {});
            const records = raw_records
                .map(({ products, price, sale_time }) => ({
                products: products.map((_) => products_by_id[_].name),
                price,
                time: sale_time,
                type: products_by_id[products[0]].type,
            }));
            const data = {
                products, prices, records, colors,
            };
            const con = {
                start: new Date(raw_con.start_date),
                end: new Date(raw_con.end_date),
                title: raw_con.title,
                code: con_code,
                data,
            };
            return con;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.getConInfo = getConInfo;
function writeRecords(user_id, con_code, records) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const [, { user_con_id }] = yield getCon(user_id, con_code, client);
            const { rows: raw_products } = yield client.query(sql_template_strings_1.default `SELECT product_id, name FROM Products WHERE user_id = ${user_id} AND name = ANY(${records.map(_ => _.products)})`);
            const products_by_id = raw_products
                .reduce((_, { name, product_id }) => (Object.assign({}, _, { [product_id]: name })), {});
            records.forEach(({ price, products, time }) => __awaiter(this, void 0, void 0, function* () {
                yield client.query(sql_template_strings_1.default `INSERT INTO Records (user_con_id, price, products, sale_time) VALUES (${user_con_id}, ${price}, ${products.map(_ => products_by_id[_])}, ${time})`);
            }));
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.writeRecords = writeRecords;
function getUserProducts(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows: raw_types } = yield client.query(sql_template_strings_1.default `SELECT type_id, name FROM ProductTypes WHERE user_id = ${user_id}`);
            const { rows: raw_products } = yield client.query(sql_template_strings_1.default `SELECT product_id, type_id, name FROM Products WHERE user_id = ${user_id}`);
            const { rows: raw_inventory } = yield client.query(sql_template_strings_1.default `SELECT quantity, product_id FROM Inventory WHERE user_id = ${user_id}`);
            const types = raw_types
                .reduce((_, { type_id, name }) => (Object.assign({}, _, { [type_id]: name })), {});
            const products_by_id = raw_products
                .reduce((_, { type_id, name, product_id }) => (Object.assign({}, _, { [product_id]: {
                    name,
                    type: types[type_id],
                } })), {});
            const products = raw_inventory
                .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
                .reduce((_, { product: { type, name }, quantity }) => (Object.assign({}, _, { [type]: [
                    ...(_[type] || []),
                    [name, quantity],
                ] })), {});
            return products;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.getUserProducts = getUserProducts;
function getUserPrices(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows: raw_types } = yield client.query(sql_template_strings_1.default `SELECT type_id, name FROM ProductTypes WHERE user_id = ${user_id}`);
            const { rows: raw_products } = yield client.query(sql_template_strings_1.default `SELECT product_id, type_id, name FROM Products WHERE user_id = ${user_id}`);
            const { rows: raw_prices } = yield client.query(sql_template_strings_1.default `SELECT type_id, product_id, prices FROM Prices WHERE user_id = ${user_id}`);
            const types = raw_types
                .reduce((_, { type_id, name }) => (Object.assign({}, _, { [type_id]: name })), {});
            const products_by_id = raw_products
                .reduce((_, { product_id, type_id, name }) => (Object.assign({}, _, { [product_id]: {
                    name,
                    type: types[type_id],
                } })), {});
            const prices = raw_prices
                .reduce((_, { type_id, product_id, prices }) => (Object.assign({}, _, { [`${types[type_id]}${product_id ? `.${products_by_id[product_id].name}` : ''}`]: prices })), {});
            return prices;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.getUserPrices = getUserPrices;
