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
const bcrypt = require("bcrypt");
const sql_template_strings_1 = require("sql-template-strings");
const config = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
} : {
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
function query(query) {
    return pool.query(query);
}
function byId(id) {
    return _ => _.id === id;
}
function getCon(user_id, con_code, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows: raw_con } = yield client.query(sql_template_strings_1.default `SELECT * FROM Conventions WHERE UPPER(code) = ${con_code.toUpperCase()}`);
        if (!raw_con.length) {
            throw new DBError(`No con '${con_code}' exists`);
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
            const { rows: raw_types } = yield client.query(sql_template_strings_1.default `SELECT type_id, name, color, discontinued FROM ProductTypes WHERE user_id = ${user_id}`);
            const { rows: raw_products } = yield client.query(sql_template_strings_1.default `SELECT product_id, type_id, name, discontinued FROM Products WHERE user_id = ${user_id}`);
            const { rows: raw_inventory } = yield client.query(sql_template_strings_1.default `SELECT product_id, quantity FROM Inventory WHERE user_con_id = ${user_con_id}`);
            const { rows: raw_prices } = yield client.query(sql_template_strings_1.default `SELECT type_id, product_id, prices FROM Prices WHERE user_con_id = ${user_con_id}`);
            const { rows: raw_records } = yield client.query(sql_template_strings_1.default `SELECT products, price::money::numeric::float8, sale_time FROM Records WHERE user_con_id = ${user_con_id}`);
            const inventory = raw_inventory.map(_ => ({ quantity: _.quantity, id: _.product_id }));
            const types = raw_types.map(_ => ({ id: _.type_id, name: _.name, discontinued: _.discontinued, color: _.color }));
            const products = inventory.map(_ => {
                const product = raw_products.map(_ => (Object.assign({}, _, { id: _.product_id }))).find(byId(_.id));
                if (!product) {
                    throw new DBError('Inventory listed for non-existent product');
                }
                return Object.assign({}, _, { type: product.type_id, name: product.name, discontinued: product.discontinued });
            });
            const prices = raw_prices.map(_ => ({ type: _.type_id, product: _.product_id, prices: _.prices }));
            const records = raw_records.map(_ => ({ price: _.price, products: _.products, time: _.sale_time }));
            const data = {
                products, prices, records, types,
            };
            const con = {
                type: 'full',
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
function getUserMetaConventions(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows } = yield client.query(sql_template_strings_1.default `
        SELECT Conventions.title, Conventions.code, Conventions.start_date, Conventions.end_date
        FROM User_Conventions
        INNER JOIN Conventions ON Conventions.con_id = User_Conventions.con_id
        WHERE user_id = ${user_id}
      `);
            return rows.map(({ title, code, start_date, end_date }) => ({
                type: 'meta',
                title, code,
                start: new Date(start_date),
                end: new Date(end_date),
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
exports.getUserMetaConventions = getUserMetaConventions;
function writeUserConventions(user_id, conventions) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            yield client.query(sql_template_strings_1.default `BEGIN`);
            let { rows: [{ keys }] } = yield client.query(sql_template_strings_1.default `SELECT keys FROM Users WHERE user_id = ${user_id}`);
            keys -= (yield client.query(sql_template_strings_1.default `SELECT 1 FROM User_Conventions WHERE user_id = ${user_id}`)).rowCount;
            for (const con of conventions.sort((a, b) => (a.type === 'remove' ? 0 : 1) - (b.type === 'remove' ? 0 : 1))) {
                const { code } = con;
                const { rows: [{ con_id }] } = yield client.query(sql_template_strings_1.default `SELECT con_id FROM Conventions WHERE code = ${code}`);
                switch (con.type) {
                    case 'add': {
                        if (keys) {
                            yield client.query(sql_template_strings_1.default `INSERT INTO User_Conventions (user_id, con_id) VALUES (${user_id},${con_id})`);
                            --keys;
                        }
                        else {
                            throw new DBError('You do not have enough unused keys to sign up for another convention');
                        }
                        break;
                    }
                    case 'remove': {
                        const { rows: [{ start_date }] } = yield client.query(sql_template_strings_1.default `SELECT start_date FROM Conventions WHERE con_id = ${con_id}`);
                        if (start_date >= Date.now()) {
                            throw new DBError('Cannot remove yourself from a convention that has started already');
                        }
                        const { rowCount } = yield client.query(sql_template_strings_1.default `DELETE FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`);
                        keys += rowCount;
                        break;
                    }
                    case 'modify': {
                        const { data } = con;
                        const { rows: [{ user_con_id }] } = yield client.query(sql_template_strings_1.default `SELECT user_con_id FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`);
                        for (const { id, quantity, discontinued } of data.products || []) {
                            if (!discontinued) {
                                yield client.query(sql_template_strings_1.default `
                INSERT INTO Inventory (user_con_id, product_id, quantity)
                  VALUES (${user_con_id},${id},${quantity})
                ON CONFLICT ON CONSTRAINT unique_inventory DO UPDATE
                  SET quantity = ${quantity}
              `);
                            }
                            else {
                                yield client.query(sql_template_strings_1.default `DELETE FROM Inventory WHERE user_con_id = ${user_con_id} AND product_id = ${id}`);
                            }
                        }
                        for (const { type_id, product_id, price } of data.prices || []) {
                            if (price.length) {
                                yield client.query(sql_template_strings_1.default `
                INSERT INTO Prices (user_con_id, type_id, product_id, prices)
                  VALUES (${user_con_id},${type_id},${product_id},${price})
                ON CONFLICT ON CONSTRAINT unique_prices DO UPDATE
                  SET prices = ${price}
              `);
                            }
                            else {
                                yield client.query(sql_template_strings_1.default `DELETE FROM Prices WHERE user_con_id = ${user_con_id} AND type_id = ${type_id}`
                                    .append(product_id ? sql_template_strings_1.default ` AND product_id = ${product_id}` : sql_template_strings_1.default ` AND product_id IS NULL`));
                            }
                        }
                        break;
                    }
                }
            }
            yield client.query(sql_template_strings_1.default `COMMIT`);
        }
        catch (error) {
            yield client.query(sql_template_strings_1.default `ROLLBACK`);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.writeUserConventions = writeUserConventions;
function writeRecords(user_id, con_code, records) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const [, { user_con_id }] = yield getCon(user_id, con_code, client);
            const sold = [];
            yield client.query(sql_template_strings_1.default `BEGIN`);
            for (const { price, products, time } of records) {
                yield client.query(sql_template_strings_1.default `
        INSERT INTO Records (user_con_id, price, products, sale_time)
        VALUES (${user_con_id}, ${price}, ${products}, ${new Date(time)})
      `);
                products.forEach(product => sold[product] = (sold[product] || 0) + 1);
            }
            for (const [product, quantity] of sold.entries()) {
                if (quantity) {
                    yield client.query(sql_template_strings_1.default `
          INSERT INTO Inventory (product_id, user_con_id, quantity)
          SELECT ${product}, ${user_con_id}, quantity FROM Inventory
          WHERE user_id = ${user_id} AND product_id = ${product}
          ON CONFLICT DO NOTHING
        `);
                    yield client.query(sql_template_strings_1.default `
          UPDATE Inventory SET quantity = GREATEST(quantity - ${quantity}, 0)
          WHERE product_id = ${product} AND user_id = ${user_id}
        `);
                }
            }
            yield client.query(sql_template_strings_1.default `COMMIT`);
        }
        catch (error) {
            yield client.query(sql_template_strings_1.default `ROLLBACK`);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.writeRecords = writeRecords;
function getUserProducts(user_id, includeDiscontinued = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows: raw_products } = yield client.query(sql_template_strings_1.default `SELECT product_id, type_id, name, discontinued FROM Products WHERE user_id = ${user_id}`
                .append(includeDiscontinued ? sql_template_strings_1.default `` : sql_template_strings_1.default ` AND discontinued = FALSE`)
                .append(sql_template_strings_1.default ` ORDER BY product_id ASC`));
            const { rows: raw_inventory } = yield client.query(sql_template_strings_1.default `SELECT quantity, product_id FROM Inventory WHERE user_id = ${user_id}`);
            const inventory = raw_inventory.map(_ => ({ id: _.product_id, quantity: _.quantity }));
            const products = raw_products.map(_ => ({ type: _.type_id, id: _.product_id, name: _.name, discontinued: _.discontinued, quantity: inventory.find(byId(_.product_id)).quantity }));
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
            const { rows: raw_prices } = yield client.query(sql_template_strings_1.default `SELECT type_id, product_id, prices FROM Prices WHERE user_id = ${user_id} AND array_length(prices, 1) > 0`);
            const prices = raw_prices.map(_ => ({ type: _.type_id, product: _.product_id, prices: _.prices }));
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
function getUserTypes(user_id, includeDiscontinued = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows: raw_types } = yield client.query(sql_template_strings_1.default `SELECT type_id, name, color, discontinued FROM ProductTypes WHERE user_id = ${user_id}`
                .append(includeDiscontinued ? sql_template_strings_1.default `` : sql_template_strings_1.default ` AND discontinued = FALSE`)
                .append(sql_template_strings_1.default ` ORDER BY type_id ASC`));
            const types = raw_types.map(_ => ({ id: _.type_id, name: _.name, color: _.color, discontinued: _.discontinued }));
            return types;
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.getUserTypes = getUserTypes;
function writeProducts(user_id, products) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            yield client.query(sql_template_strings_1.default `BEGIN`);
            const result = [];
            for (const product of products) {
                switch (product.kind) {
                    case 'create': {
                        const { name, type, quantity } = product;
                        const { rows: [{ product_id }] } = yield client.query(sql_template_strings_1.default `INSERT INTO Products (name,type_id,user_id) VALUES (${name},${type},${user_id}) RETURNING product_id`);
                        yield client.query(sql_template_strings_1.default `INSERT INTO Inventory (quantity,product_id,user_id) VALUES (${quantity},${product_id},${user_id})`);
                        result.push({ name, id: product_id, type, quantity, discontinued: false });
                        break;
                    }
                    case 'modify': {
                        const { id, name, quantity, discontinued } = product;
                        yield client.query(sql_template_strings_1.default `UPDATE Products SET name = ${name}, discontinued = ${discontinued} WHERE product_id = ${id} AND user_id = ${user_id}`);
                        yield client.query(sql_template_strings_1.default `UPDATE Inventory SET quantity = ${quantity} WHERE product_id = ${id} AND user_id = ${user_id}`);
                        break;
                    }
                }
            }
            yield client.query(sql_template_strings_1.default `COMMIT`);
            return result;
        }
        catch (error) {
            yield client.query(sql_template_strings_1.default `ROLLBACK`);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.writeProducts = writeProducts;
function writePrices(user_id, prices) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            yield client.query(sql_template_strings_1.default `BEGIN`);
            const result = [];
            for (const { type_id, product_id, price } of prices) {
                const { rowCount } = yield client.query(sql_template_strings_1.default `SELECT 1 FROM Prices WHERE user_id = ${user_id} AND type_id = ${type_id}`
                    .append(product_id ? sql_template_strings_1.default ` AND product_id = ${product_id}` : sql_template_strings_1.default ` AND product_id IS NULL`));
                if (rowCount === 1) {
                    yield client.query(sql_template_strings_1.default `UPDATE Prices SET prices = ${price} WHERE type_id = ${type_id} AND user_id = ${user_id}`
                        .append(product_id ? sql_template_strings_1.default ` AND product_id = ${product_id}` : sql_template_strings_1.default ` AND product_id IS NULL`));
                }
                else {
                    yield client.query(sql_template_strings_1.default `INSERT INTO Prices (prices,type_id,product_id,user_id) VALUES (${price},${type_id},${product_id},${user_id})`);
                    result.push({ type: type_id, product: product_id, prices: price });
                }
            }
            yield client.query(sql_template_strings_1.default `COMMIT`);
            return result;
        }
        catch (error) {
            yield client.query(sql_template_strings_1.default `ROLLBACK`);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.writePrices = writePrices;
function writeTypes(user_id, types) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            yield client.query(sql_template_strings_1.default `BEGIN`);
            const result = [];
            for (const type of types) {
                switch (type.kind) {
                    case 'create': {
                        const { name, color } = type;
                        const { rows: [{ type_id }] } = yield client.query(sql_template_strings_1.default `INSERT INTO ProductTypes (user_id, name, color) VALUES (${user_id},${name},${color}) RETURNING type_id`);
                        result.push({ id: type_id, name, color, discontinued: false });
                        break;
                    }
                    case 'modify':
                        {
                            const { id, name, color, discontinued } = type;
                            yield client.query(sql_template_strings_1.default `UPDATE ProductTypes SET name = ${name}, color = ${color}, discontinued = ${discontinued} WHERE type_id = ${id} AND user_id = ${user_id}`);
                        }
                        break;
                }
            }
            yield client.query(sql_template_strings_1.default `COMMIT`);
            return result;
        }
        catch (error) {
            yield client.query(sql_template_strings_1.default `ROLLBACK`);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.writeTypes = writeTypes;
function userExists(usr) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rowCount } = yield query(sql_template_strings_1.default `SELECT 1 FROM Users WHERE email = ${usr}`);
        return rowCount === 1;
    });
}
exports.userExists = userExists;
function logInUser(usr, psw) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows: raw_user } = yield client.query(sql_template_strings_1.default `SELECT user_id, password FROM Users WHERE email = ${usr}`);
            if (raw_user.length === 1) {
                const { user_id, password } = raw_user[0];
                if (yield bcrypt.compare(psw, password)) {
                    return { user_id };
                }
                else {
                    throw new DBError('Incorrect email or password');
                }
            }
            else {
                throw new DBError('Non-existent user');
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.logInUser = logInUser;
function createUser(usr, psw) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const hash = yield bcrypt.hash(psw, 10);
            const { rowCount } = yield query(sql_template_strings_1.default `SELECT 1 FROM Users WHERE email = ${usr}`);
            if (rowCount === 1) {
                throw new DBError(`An account is already registered to ${usr}`);
            }
            yield client.query(sql_template_strings_1.default `INSERT INTO Users (email, password) VALUES (${usr},${hash})`);
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.createUser = createUser;
function getUser(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows: [user] } = yield query(sql_template_strings_1.default `SELECT email, keys FROM Users WHERE user_id = ${user_id}`);
        const { rowCount } = yield query(sql_template_strings_1.default `SELECT 1 FROM User_Conventions WHERE user_id = ${user_id}`);
        return Object.assign({}, user, { keys: user.keys - rowCount });
    });
}
exports.getUser = getUser;
function getConventions(user_id, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connect();
        try {
            const { rows: raw_cons } = yield query(sql_template_strings_1.default `
        SELECT code, title, start_date, end_date
        FROM Conventions c
        WHERE start_date > ${new Date()}
        AND NOT EXISTS (SELECT 1 FROM User_Conventions u WHERE u.user_id = ${user_id} AND u.con_id = c.con_id)`
                .append(limit ? sql_template_strings_1.default `LIMIT ${limit} OFFSET ${page * limit}` : sql_template_strings_1.default ``));
            let pages = 1;
            if (limit) {
                const { rows: [{ count }] } = yield query(sql_template_strings_1.default `SELECT count(*) / ${limit} as count FROM Conventions WHERE start_date > ${new Date()}`);
                pages = count;
            }
            const cons = raw_cons.map((_) => ({
                type: 'meta',
                title: _.title,
                code: _.code,
                start: new Date(_.start_date),
                end: new Date(_.end_date),
            }));
            return {
                data: cons,
                page,
                pages: +pages,
            };
        }
        catch (error) {
            throw error;
        }
        finally {
            client.release();
        }
    });
}
exports.getConventions = getConventions;
