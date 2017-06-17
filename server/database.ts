'use strict';
import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import * as stream from 'stream';
import SQL, { SQLStatement } from 'sql-template-strings';

import db from './schema';
import ca from '../conartist';

interface QueryResult<T> extends pg.QueryResult {
  rows: T[];
}

interface ResultBuilder<T> extends QueryResult<T> {
  addRow(row: T): void;
}

declare class Query<T> extends pg.Query {
  on(event: 'row', listener: (row: any, result?: ResultBuilder<T>) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'end', listener: (result: ResultBuilder<T>) => void): this;
}

declare class Pool extends pg.Pool {
  query(queryStream: pg.QueryConfig & stream.Readable): stream.Readable;
  query<T>(queryTextOrConfig: string | pg.QueryConfig): Promise<QueryResult<T>>;
  query<T>(queryText: string, values: any[]): Promise<QueryResult<T>>;

  query<T>(queryTextOrConfig: string | pg.QueryConfig, callback: (err: Error, result: QueryResult<T>) => void): Query<T>;
  query<T>(queryText: string, values: any[], callback: (err: Error, result: QueryResult<T>) => void): Query<T>;
}

declare class Client extends pg.Client {
  query(queryStream: pg.QueryConfig & stream.Readable): stream.Readable;
  query<T>(queryTextOrConfig: string | pg.QueryConfig): Promise<QueryResult<T>>;
  query<T>(queryText: string, values: any[]): Promise<QueryResult<T>>;

  query<T>(queryTextOrConfig: string | pg.QueryConfig, callback: (err: Error, result: QueryResult<T>) => void): Query<T>;
  query<T>(queryText: string, values: any[], callback: (err: Error, result: QueryResult<T>) => void): Query<T>;
}

const config: pg.PoolConfig = {
  user: process.env.CONARTISTPGUSER || 'conartist_app',
  database: process.env.CONARTISTDB || 'conartist',
  password: process.env.CONARTISTPASSWORD || 'temporary-password',
  host: 'localhost',
  min: 1,
  max: process.env.CONARTISTDBPOOL || 10,
  idleTimeoutMillis: process.env.CONARTISTDBTIMEOUT || 1000 * 60,
};

const pool: Pool = new pg.Pool(config);

class DBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Database Error';
  }
}

function connect(): Promise<Client> {
  return pool.connect();
}

function query<T>(query: SQLStatement): Promise<QueryResult<T>> {
  return pool.query(query);
}

// TODO: learn how databases really work and make this efficient!
// TODO: make space for errors, allowing rollbacks and such

async function getCon(user_id: number, con_code: string, client: Client): Promise<[db.Convention, db.UserConvention]> {
  const { rows: raw_con } = await client.query<db.Convention>(SQL`SELECT * FROM Conventions WHERE con_code = ${con_code}`);
  if(!raw_con.length) { throw new DBError(`No con '${con_code}' exists`); }
  const [{ con_id }] = raw_con;
  const { rows: raw_user_con } =  await client.query<db.UserConvention>(SQL`SELECT * FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`);
  if(!raw_user_con.length) { throw new DBError(`Not registered for con ${raw_con[0].title}`); }
  return [ raw_con[0], raw_user_con[0] ];
}

async function getConInfo(user_id: number, con_code: string): Promise<ca.Convention> {
  const client = await connect();
  try {
    const [ raw_con, { user_con_id }] = await getCon(user_id, con_code, client);
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name' | 'color'>>(
      SQL`SELECT type_id, name, color FROM ProductTypes WHERE user_id = ${user_id}`
    );
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name'>>(
      SQL`SELECT product_id, type_id, name FROM Products WHERE user_id = ${user_id}`
    );
    const { rows: raw_inventory } = await client.query<Pick<db.InventoryItem, 'product_id' | 'quantity'>>(
      SQL`SELECT product_id, quantity FROM Inventory WHERE user_con_id = ${user_con_id}`
    );
    const { rows: raw_prices } = await client.query<Pick<db.Price, 'type_id' | 'product_id' | 'prices'>>(
      SQL`SELECT type_id, product_id, prices FROM Prices WHERE user_con_id = ${user_con_id}`
    );
    const { rows: raw_records } = await client.query<Pick<db.Record, 'products' | 'price' | 'sale_time'>>(
      SQL`SELECT products, price, sale_time FROM Records WHERE user_con_id = ${user_con_id}`
    );
    // transform rows to data
    const types = raw_types
      .reduce((_, { type_id, name, color }) => ({
        ..._,
        [type_id]: { name, color, id: type_id },
      }), {} as ca.ProductTypes);
    const products_by_id = raw_products
      .reduce((_, { product_id, type_id, name }) => ({
        ..._,
        [product_id]: {
          name,
          type: types[type_id].name,
          id: product_id,
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductType; id: number; }});
    const products = raw_inventory
      .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
      .reduce((_, { product: { type, name, id }, quantity }) => ({
        ..._,
        [type]: [
          ...(_[type] || []),
          { name, quantity, id },
        ],
      }), {} as ca.Products);
    const prices = raw_prices
      .reduce((_, { type_id, product_id, prices }) => ({
        ..._,
        [`${types[type_id]}${product_id ? `::${products_by_id[product_id].name}` : ''}`]: prices,
      }), {} as ca.Prices);
    const records: ca.Records = raw_records
      .map(({ products, price, sale_time }) => ({
        products: products.map((_: number) => products_by_id[_].name),
        price,
        time: sale_time,
        type: products_by_id[products[0]].type,
      }));
    const data: ca.ConventionData = {
      products, prices, records, types,
    };
    const con: ca.Convention = {
      start: new Date(raw_con.start_date),
      end: new Date(raw_con.end_date),
      title: raw_con.title,
      code: con_code,
      data,
    };
    return con;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writeRecords(user_id: number, con_code: string, records: ca.RecordsUpdate): Promise<void> {
  const client = await connect();
  try {
    const [, { user_con_id }] = await getCon(user_id, con_code, client);
    for(const { price, products, time } of records) {
      await client.query(
        SQL`INSERT INTO Records (user_con_id, price, products, sale_time) VALUES (${user_con_id}, ${price}, ${products}, ${time})`
      );
    }
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function getUserProducts(user_id: number): Promise<ca.Products> {
  const client = await connect();
  try {
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name'>>(
      SQL`SELECT type_id, name FROM ProductTypes WHERE user_id = ${user_id}`
    );
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name'>>(
      SQL`SELECT product_id, type_id, name FROM Products WHERE user_id = ${user_id}`
    );
    const { rows: raw_inventory } = await client.query<Pick<db.InventoryItem, 'quantity' | 'product_id'>>(
      SQL`SELECT quantity, product_id FROM Inventory WHERE user_id = ${user_id}`
    );
    const types = raw_types
      .reduce((_, { type_id, name }) => ({
        ..._,
        [type_id]: name,
      }), {} as { [key: number]: ca.ProductType });
    const products_by_id = raw_products
      .reduce((_, { type_id, name, product_id }) => ({
        ..._,
        [product_id]: {
          name,
          type: types[type_id],
          id: product_id,
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductType; id: number; }});
    const products = raw_inventory
      .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
      .reduce((_, { product: { type, name, id }, quantity }) => ({
        ..._,
        [type]: [
          ...(_[type] || []),
          { name, quantity, id },
        ],
      }), {} as ca.Products);
    return products;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function getUserPrices(user_id: number): Promise<ca.Prices> {
  const client = await connect();
  try {
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name'>>(
      SQL`SELECT type_id, name FROM ProductTypes WHERE user_id = ${user_id}`
    );
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name'>>(
      SQL`SELECT product_id, type_id, name FROM Products WHERE user_id = ${user_id}`
    );
    const { rows: raw_prices } = await client.query<Pick<db.Price, 'type_id' | 'product_id' | 'prices'>>(
      SQL`SELECT type_id, product_id, prices FROM Prices WHERE user_id = ${user_id}`
    );
    const types = raw_types
      .reduce((_, { type_id, name }) => ({
        ..._,
        [type_id]: name,
      }), {} as { [key: number]: ca.ProductType });
    const products_by_id = raw_products
      .reduce((_, { product_id, type_id, name }) => ({
        ..._,
        [product_id]: {
          name,
          type: types[type_id],
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductType; }});
    const prices = raw_prices
      .reduce((_, { type_id, product_id, prices }) => ({
        ..._,
        [`${types[type_id]}${product_id ? `::${products_by_id[product_id].name}` : ''}`]: prices,
      }), {} as ca.Prices);
    return prices;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writeProducts(user_id: number, products: ca.ProductsUpdate): Promise<void> {
  const client = await connect();
  try {
    for(const { id, name, quantity } of products) {
      if(name) {
        await client.query(
          SQL`UPDATE Products SET name = ${name} WHERE product_id = ${id}`
        );
      }
      if(quantity) {
        await client.query(
          SQL`UPDATE Inventory SET quantity = ${quantity} WHERE product_id = ${id} AND user_id = ${user_id}`
        );
      }
    }
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writePrices(user_id: number, prices: ca.PricesUpdate): Promise<void> {
  const client = await connect();
  try {
    for(const { type_id, product_id, price } of prices) {
      await client.query(
        SQL`UPDATE Prices SET prices = ${price} WHERE type_id = ${type_id} AND product_id = ${product_id} AND user_id = ${user_id}`
      );
    }
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function userExists(usr: string): Promise<boolean> {
  const { rows } = await query<{ count: number }>(SQL`SELECT 1 FROM Users WHERE email = ${usr}`);
  return rows.length === 1;
}

async function logInUser(usr: string, psw: string): Promise<Pick<db.User, 'user_id'>> {
  const client = await connect();
  try {
    const { rows: raw_user } = await client.query<Pick<db.User, 'user_id' | 'password'>>(SQL`SELECT user_id, password FROM Users WHERE email = ${usr}`);
    if(raw_user.length === 1) {
      const { user_id, password } = raw_user[0];
      if(await bcrypt.compare(psw, password)) {
        return { user_id };
      } else {
        throw new DBError('Incorrect email or password');
      }
    } else {
      throw new DBError('Non-existent user');
    }
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function createUser(usr: string, psw: string): Promise<void> {
  const client = await connect();
  try {
    const hash = await bcrypt.hash(psw, 10);
    const { rows } = await query<{ count: number }>(SQL`SELECT 1 FROM Users WHERE email = ${usr}`);
    if(rows.length === 1) {
      throw new DBError(`An account is already registered to ${usr}`);
    }
    await client.query(
      SQL`INSERT INTO Users (email, password) VALUES (${usr},${hash})`
    );
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

export {
  getConInfo, writeRecords,
  getUserProducts, writeProducts,
  getUserPrices, writePrices,
  userExists, logInUser, createUser,
};
