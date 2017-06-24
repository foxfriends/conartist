'use strict';
import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import * as stream from 'stream';
import SQL, { SQLStatement } from 'sql-template-strings';

import db from './schema';
import * as ca from '../conartist';

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
// TODO: make space for errors, with transactions or rollbacks or whatever it is

async function getCon(user_id: number, con_code: string, client: Client): Promise<[db.Convention, db.UserConvention]> {
  const { rows: raw_con } = await client.query<db.Convention>(SQL`SELECT * FROM Conventions WHERE con_code = ${con_code}`);
  if(!raw_con.length) { throw new DBError(`No con '${con_code}' exists`); }
  const [{ con_id }] = raw_con;
  const { rows: raw_user_con } =  await client.query<db.UserConvention>(SQL`SELECT * FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`);
  if(!raw_user_con.length) { throw new DBError(`Not registered for con ${raw_con[0].title}`); }
  return [ raw_con[0], raw_user_con[0] ];
}

async function getConInfo(user_id: number, con_code: string): Promise<ca.FullConvention> {
  const client = await connect();
  try {
    const [ raw_con, { user_con_id }] = await getCon(user_id, con_code, client);
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name' | 'color' | 'discontinued'>>(
      SQL`SELECT type_id, name, color, discontinued FROM ProductTypes WHERE user_id = ${user_id}`
    );
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name' | 'discontinued'>>(
      SQL`SELECT product_id, type_id, name, discontinued FROM Products WHERE user_id = ${user_id}`
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
      .reduce((_, { type_id, name, color, discontinued }) => ({
        ..._,
        [name]: { name, color, id: type_id, discontinued },
      }), {} as ca.ProductTypes);
    const types_by_id = raw_types
      .reduce((_, { type_id, name, color }) => ({
        ..._,
        [type_id]: { name, color, id: type_id },
      }), {} as { [key: number]: { color: ca.Color; name: string; id: number; }});
    const products_by_id = raw_products
      .reduce((_, { product_id, type_id, name, discontinued }) => ({
        ..._,
        [product_id]: {
          name,
          type: types_by_id[type_id].name,
          id: product_id,
          discontinued,
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductTypeName; id: number; discontinued: boolean; }});
    const products = raw_inventory
      .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
      .reduce((_, { product: { type, name, id, discontinued }, quantity }) => ({
        ..._,
        [type]: [
          ...(_[type] || []),
          { name, quantity, id, type, discontinued },
        ],
      }), {} as ca.Products);
    const prices = raw_prices
      .reduce((_, { type_id, product_id, prices }) => ({
        ..._,
        [`${types_by_id[type_id].name}${product_id ? `::${products_by_id[product_id].name}` : ''}`]: prices,
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
    const con: ca.FullConvention = {
      type: 'full',
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

async function getUserMetaConventions(user_id: number): Promise<ca.MetaConvention[]> {
  const client = await connect();
  try {
    const { rows } = await client.query<Pick<db.Convention, 'title' | 'code' | 'start_date' | 'end_date'>>(
      SQL`
        SELECT Conventions.title, Conventions.code, Conventions.start_date, Conventions.end_date
        FROM User_Conventions
        INNER JOIN Conventions ON Conventions.con_id = User_Conventions.con_id
        WHERE user_id = ${user_id}
      `);
    return rows.map(({ title, code, start_date, end_date }) => ({
      type: 'meta' as 'meta', // typescript why
      title, code,
      start: new Date(start_date),
      end: new Date(end_date)
    }));
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
};

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

async function getUserProducts(user_id: number, includeDiscontinued: boolean = false): Promise<ca.Products> {
  const client = await connect();
  try {
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name'>>(
      SQL`SELECT type_id, name FROM ProductTypes WHERE user_id = ${user_id}`
    );
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name' | 'discontinued'>>(
      SQL`SELECT product_id, type_id, name, discontinued FROM Products WHERE user_id = ${user_id}`.append(includeDiscontinued ? SQL`` : SQL`AND discontinued = FALSE`)
    );
    const { rows: raw_inventory } = await client.query<Pick<db.InventoryItem, 'quantity' | 'product_id'>>(
      SQL`SELECT quantity, product_id FROM Inventory WHERE user_id = ${user_id}`
    );
    const types = raw_types
      .reduce((_, { type_id, name }) => ({
        ..._,
        [type_id]: name,
      }), {} as { [key: number]: ca.ProductTypeName });
    const products_by_id = raw_products
      .reduce((_, { type_id, name, product_id, discontinued }) => ({
        ..._,
        [product_id]: {
          name,
          type: types[type_id],
          id: product_id,
          discontinued,
        },
      }), {} as { [key: number]: { name: string; type: ca.ProductTypeName; id: number; discontinued: boolean; }});
    const products = raw_inventory
      .map(({ product_id, quantity }) => ({ product: products_by_id[product_id], quantity }))
      .reduce((_, { product: { type, name, id, discontinued }, quantity }) => ({
        ..._,
        [type]: [
          ...(_[type] || []),
          { name, quantity, id, type, discontinued },
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
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name' | 'discontinued'>>(
      SQL`SELECT type_id, name, discontinued FROM ProductTypes WHERE user_id = ${user_id}`
    );
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name' | 'discontinued'>>(
      SQL`SELECT product_id, type_id, name, discontinued FROM Products WHERE user_id = ${user_id}`
    );
    const { rows: raw_prices } = await client.query<Pick<db.Price, 'type_id' | 'product_id' | 'prices'>>(
      SQL`SELECT type_id, product_id, prices FROM Prices WHERE user_id = ${user_id}`
    );
    const types = raw_types
      .reduce((_, { type_id, name, discontinued }) => discontinued ? _ : {
        ..._,
        [type_id]: name,
      }, {} as { [key: number]: ca.ProductTypeName });
    const products = raw_products
      .reduce((_, { product_id, type_id, name, discontinued }) => discontinued ? _ : {
        ..._,
        [product_id]: {
          name,
          type: types[type_id],
        },
      }, {} as { [key: number]: { name: string; type: ca.ProductTypeName; }});
    const prices = raw_prices
      .reduce((_, { type_id, product_id, prices }) => !types[type_id] || product_id === null || !products[product_id] ? _ : {
        ..._,
        [`${types[type_id]}${product_id ? `::${products[product_id].name}` : ''}`]: prices,
      }, {} as ca.Prices);
    return prices;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function getUserTypes(user_id: number, includeDiscontinued: boolean = false): Promise<ca.ProductTypes> {
  const client = await connect();
  try {
    const { rows: raw_types } = await client.query<Pick<db.ProductType, 'type_id' | 'name' | 'color' | 'discontinued'>>(
      SQL`SELECT type_id, name, color, discontinued FROM ProductTypes WHERE user_id = ${user_id}`.append(includeDiscontinued ? SQL`` : SQL`AND discontinued = FALSE`)
    );
    const types = raw_types
      .reduce((_, { type_id, name, color, discontinued }) => ({
        ..._,
        [name]: { name, color, id: type_id, discontinued },
      }), {} as ca.ProductTypes);
    return types;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writeProducts(user_id: number, products: ca.ProductsUpdate): Promise<ca.Products> {
  const client = await connect();
  try {
    const result = {} as ca.Products;
    for(const product of products) {
      switch(product.kind) {
        case 'create': {
          const { name, type, quantity } = product;
          const { rows: [{ product_id }]} = await client.query<Pick<db.Product, 'product_id'>>(
            SQL`INSERT INTO Products (name,type_id,user_id) VALUES (${name},${type},${user_id}) RETURNING product_id`
          );
          const { rows: [{ name: type_name }]} = await client.query<Pick<db.ProductType, 'name'>>(
            SQL`SELECT name FROM ProductTypes WHERE type_id = ${type}`
          );
          await client.query(
            SQL`INSERT INTO Inventory (quantity,product_id,user_id) VALUES (${quantity},${product_id},${user_id})`
          );
          result[type_name] = result[type_name] || [];
          result[type_name].push({ name, id: product_id, type: type_name, quantity, discontinued: false });
          break;
        }
        case 'modify': {
          const { id, name, quantity, discontinued } = product;
          if(name) {
            await client.query(
              SQL`UPDATE Products SET name = ${name} WHERE product_id = ${id} AND user_id = ${user_id}`
            );
          }
          if(quantity) {
            await client.query(
              SQL`UPDATE Inventory SET quantity = ${quantity} WHERE product_id = ${id} AND user_id = ${user_id}`
            );
          }
          if(discontinued === false) {
            await client.query(
              SQL`UPDATE Products SET discontinued = FALSE WHERE product_id = ${id} AND user_id = ${user_id}`
            );
          }
          break;
        }
        case 'discontinue': {
          const { id } = product;
          await client.query(
            SQL`UPDATE Products SET discontinued = TRUE WHERE product_id = ${id} AND user_id = ${user_id}`
          );
        }
      }
    }
    return result;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writePrices(user_id: number, prices: ca.PricesUpdate): Promise<ca.Prices> {
  const client = await connect();
  try {
    const result = {} as ca.Prices;
    for(const { type_id, product_id, price } of prices) {
      const { rowCount } = await client.query(SQL`SELECT 1 FROM Prices WHERE user_id = ${user_id} AND type_id = ${type_id} AND product_id = ${product_id}`);
      if(rowCount === 1) {
        await client.query(
          SQL`UPDATE Prices SET prices = ${price} WHERE type_id = ${type_id} AND product_id = ${product_id} AND user_id = ${user_id}`
        );
      } else {
        await client.query(
          SQL`INSERT INTO Prices (prices,type_id,product_id,user_id) VALUES (${price},${type_id},${product_id},${user_id})`
        );
        const { rows: [{ name }] } = await client.query<Pick<db.ProductType, 'name'>>(
          SQL`SELECT name FROM ProductTypes WHERE type_id = ${type_id}`
        );
        let key = name;
        if(product_id) {
          const { rows: [{ name }] } = await client.query<Pick<db.Product, 'name'>>(
            SQL`SELECT name FROM Products WHERE product_id = ${product_id}`
          );
          key += '::' + name;
        }
        result[key] = price;
      }
    }
    return result;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writeTypes(user_id: number, types: ca.TypesUpdate): Promise<ca.ProductTypes> {
  const client = await connect();
  try {
    const result = {} as ca.ProductTypes;
    for(const type of types) {
      switch(type.kind) {
        case 'create': {
          const { name, color } = type;
          const { rows: [{ type_id }] } = await client.query<Pick<db.ProductType, 'type_id'>>(
            SQL`INSERT INTO ProductTypes (user_id, name, color) VALUES (${user_id},${name},${color}) RETURNING type_id`
          );
          result[name] = { id: type_id, name, color, discontinued: false };
          break;
        }
        case 'modify': {
          const { id, name, color, discontinued } = type;
          if(name) {
            await client.query(
              SQL`UPDATE ProductTypes SET name = ${name} WHERE type_id = ${id} AND user_id = ${user_id}`
            );
          }
          if(color) {
            await client.query(
              SQL`UPDATE ProductTypes SET color = ${color} WHERE type_id = ${id} AND user_id = ${user_id}`
            );
          }
          if(discontinued === false) {
            await client.query(
              SQL`UPDATE ProductTypes SET discontinued = FALSE WHERE type_id = ${id} AND user_id = ${user_id}`
            );
          }
          break;
        }
        case 'discontinue': {
          const { id } = type;
          await client.query(
            SQL`UPDATE ProductTypes SET discontinued = TRUE WHERE type_id = ${id} AND user_id = ${user_id}`
          );
          break;
        }
      }
    }
    return result;
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function userExists(usr: string): Promise<boolean> {
  const { rowCount } = await query(SQL`SELECT 1 FROM Users WHERE email = ${usr}`);
  return rowCount === 1;
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
    const { rowCount } = await query<{ count: number }>(SQL`SELECT 1 FROM Users WHERE email = ${usr}`);
    if(rowCount === 1) {
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

async function getUser(user_id: number): Promise<Pick<db.User, 'email' | 'keys'>> {
  const { rows: [ user ]} = await query<Pick<db.User, 'email' | 'keys'>>(
    SQL`SELECT email, keys FROM Users WHERE user_id = ${user_id}`
  );
  return user;
}

export {
  getConInfo, writeRecords,
  getUserProducts, writeProducts,
  getUserPrices, writePrices,
  getUserTypes, writeTypes,
  getUser, getUserMetaConventions,
  userExists, logInUser, createUser,
};
