'use strict';
import * as pg from 'pg';
import SQL from 'sql-template-strings';

import db from './schema';
import ca from '../conartist';

const config: pg.PoolConfig = {
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
  constructor(message: string) {
    super(message);
    this.name = 'Database Error';
  }
}

function connect(): Promise<pg.Client> {
  return pool.connect();
}

// TODO: learn how databases really work and make this efficient!

async function logInUser(usr: string, psw: string): Promise<db.User> {
  const client = await connect();
  try {
    const { rows: raw_user } = await client.query<db.User>(SQL`SELECT * FROM Users WHERE email = ${usr} and password = ${psw}`);
    if(raw_user.length === 1) {
      return raw_user[0];
    } else {
      throw new DBError('Invalid username or password');
    }
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function getCon(user_id: number, con_code: string, client: pg.Client): Promise<[db.Convention, db.UserConvention]> {
  const { rows: raw_con } = await client.query<db.Convention>(SQL`SELECT * FROM Conventions WHERE con_code = ${con_code}`);
  if(!raw_con.length) { throw new DBError(`No con "${con_code}" exists`); }
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
    const { rows: raw_inventory } = await client.query<Pick<db.InventoryItem, 'product_id' | 'quantity' >>(
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
        [type_id]: { name, color },
      }), {} as { [key: number]: { name: ca.ProductType, color: ca.Color } });
    const colors = raw_types
      .reduce((_, { name, color }) => ({
        ..._,
        [name]: color,
      }), {} as { [key in ca.ProductType]: ca.Color });
    const products_by_id = raw_products
      .reduce((_, { product_id, type_id, name }) => ({
        ..._,
        [product_id]: {
          name,
          type: types[type_id].name,
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductType; }});
    const products = raw_inventory
      .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
      .reduce((_, { product: { type, name }, quantity }) => ({
        ..._,
        [type]: [
          ...(_[type] || []),
          [name, quantity] as [string, number],
        ],
      }), {} as ca.Products);
    const prices = raw_prices
      .reduce((_, { type_id, product_id, prices }) => ({
        ..._,
        [`${types[type_id]}${product_id ? `.${products_by_id[product_id].name}` : ''}`]: prices,
      }), {} as ca.Prices);
    const records: ca.Records = raw_records
      .map(({ products, price, sale_time }) => ({
        products: products.map((_: number) => products_by_id[_].name),
        price,
        time: sale_time,
        type: products_by_id[products[0]].type,
      }));
    const data: ca.ConventionData = {
      products, prices, records, colors,
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

type SalesRecord = {
  products: any[];
  price: number;
  time: number;
};

async function writeRecords(user_id: number, con_code: string, records: SalesRecord[]): Promise<void> {
  const client = await connect();
  try {
    const [, { user_con_id }] = await getCon(user_id, con_code, client);
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'name'>>(
      SQL`SELECT product_id, name FROM Products WHERE user_id = ${user_id} AND name = ANY(${records.map(_ => _.products)})`
    );
    const products_by_id = raw_products
      .reduce((_, { name, product_id }) => ({
        ..._,
        [product_id]: name,
      }), {} as { [key: number]: string });
    records.forEach(async ({ price, products, time }) => {
      await client.query(
        SQL`INSERT INTO Records (user_con_id, price, products, sale_time) VALUES (${user_con_id}, ${price}, ${products.map(_ => products_by_id[_])}, ${time})`
      );
    });
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
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductType; }});
    const products = raw_inventory
      .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
      .reduce((_, { product: { type, name }, quantity }) => ({
        ..._,
        [type]: [
          ...(_[type] || []),
          [name, quantity] as [string, number],
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
        [`${types[type_id]}${product_id ? `.${products_by_id[product_id].name}` : ''}`]: prices,
      }), {} as ca.Prices);
    return prices;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

export {
  logInUser, getConInfo, writeRecords, getUserProducts, getUserPrices,
};
