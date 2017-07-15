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

function byId<ID, T extends { id: ID }>(id: ID): (_: T) => boolean {
  return _ => _.id === id;
}

// TODO: learn how databases really work and make this efficient!

async function getCon(user_id: number, con_code: string, client: Client): Promise<[db.Convention, db.UserConvention]> {
  const { rows: raw_con } = await client.query<db.Convention>(SQL`SELECT * FROM Conventions WHERE code = ${con_code}`);
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
      SQL`SELECT products, price::money::numeric::float8, sale_time FROM Records WHERE user_con_id = ${user_con_id}`
    );
    // transform rows to data
    const inventory = raw_inventory.map(_ => ({ quantity: _.quantity, id: _.product_id }));
    const types: ca.ProductTypes = raw_types.map(_ => ({ id: _.type_id, name: _.name, discontinued: _.discontinued, color: _.color }));
    const products: ca.Products = inventory.map(_ => {
      const product = raw_products.map(_ => ({ ..._, id: _.product_id })).find(byId(_.id));
      if(!product) {
        throw new DBError('Inventory listed for non-existent product');
      }
      return {
        ..._,
        type: product.type_id,
        name: product.name,
        discontinued: product.discontinued,
      };
    });
    const prices: ca.Prices = raw_prices.map(_ => ({ type: _.type_id, product: _.product_id, prices: _.prices }));
    const records: ca.Records = raw_records.map(_ => ({ price: _.price, products: _.products, time: _.sale_time }));
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
      end: new Date(end_date),
    }));
  } catch(error) {
    throw error;
  } finally {
    client.release();
  }
}

async function writeUserConventions(user_id: number, conventions: ca.ConventionsUpdate): Promise<void> {
  const client = await connect();
  try {
    await client.query(SQL`BEGIN`);
    let { rows: [{ keys }]} = await client.query<Pick<db.User, 'keys'>>(
      SQL`SELECT keys FROM Users WHERE user_id = ${user_id}`
    );
    keys -= (await client.query(SQL`SELECT 1 FROM User_Conventions WHERE user_id = ${user_id}`)).rowCount;
    // sort to do removes first so that keys can be used optimally
    for(const con of conventions.sort((a, b) => (a.type === 'remove' ? 0 : 1) - (b.type === 'remove' ? 0 : 1))) {
      const { code } = con;
      const { rows: [{ con_id }] } = await client.query<Pick<db.Convention, 'con_id'>>(
        SQL`SELECT con_id FROM Conventions WHERE code = ${code}`
      );
      switch(con.type) {
        case 'add': {
          if(keys) {
            await client.query(
              SQL`INSERT INTO User_Conventions (user_id, con_id) VALUES (${user_id},${con_id})`
            );
            --keys;
          } else {
            throw new DBError('You do not have enough unused keys to sign up for another convention');
          }
          break;
        }
        case 'remove': {
          const { rows: [{ start_date }]} = await client.query<Pick<db.Convention, 'start_date'>>(
            SQL`SELECT start_date FROM Conventions WHERE con_id = ${con_id}`
          );
          if(start_date >= Date.now()) {
            throw new DBError('Cannot remove yourself from a convention that has started already');
          }
          const { rowCount } = await client.query(
            SQL`DELETE FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`
          );
          keys += rowCount;
          break;
        }
        case 'modify': {
          const { data } = con;
          const { rows: [{ user_con_id }]} = await client.query<Pick<db.UserConvention, 'user_con_id'>>(
            SQL`SELECT user_con_id FROM User_Conventions WHERE user_id = ${user_id} AND con_id = ${con_id}`
          );
          for(const { id, quantity, discontinued } of data.products || []) {
            if(!discontinued) {
              await client.query(SQL`
                INSERT INTO Inventory (user_con_id, product_id, quantity)
                  VALUES (${user_con_id},${id},${quantity})
                ON CONFLICT ON CONSTRAINT unique_inventory DO UPDATE
                  SET quantity = ${quantity}
              `);
            } else {
              await client.query(
                SQL`DELETE FROM Inventory WHERE user_con_id = ${user_con_id} AND product_id = ${id}`
              );
            }
          }
          for(const { type_id, product_id, price } of data.prices || []) {
            if(price.length) {
              await client.query(SQL`
                INSERT INTO Prices (user_con_id, type_id, product_id, prices)
                  VALUES (${user_con_id},${type_id},${product_id},${price})
                ON CONFLICT ON CONSTRAINT unique_prices DO UPDATE
                  SET prices = ${price}
              `);
            } else {
              await client.query(
                SQL`DELETE FROM Prices WHERE user_con_id = ${user_con_id} AND type_id = ${type_id}`
                  .append(product_id ? SQL` AND product_id = ${product_id}` : SQL` AND product_id IS NULL`)
              );
            }
          }
          break;
        }
      }
    }
    await client.query(SQL`COMMIT`);
  } catch(error) {
    await client.query(SQL`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
}

async function writeRecords(user_id: number, con_code: string, records: ca.RecordsUpdate): Promise<void> {
  const client = await connect();
  try {
    const [, { user_con_id }] = await getCon(user_id, con_code, client);
    const sold: (number|undefined)[] = [];
    await client.query(SQL`BEGIN`);
    for(const { price, products, time } of records) {
      await client.query(SQL`
        INSERT INTO Records (user_con_id, price, products, sale_time)
        VALUES (${user_con_id}, ${price}, ${products}, ${new Date(time)})
      `);
      products.forEach(product => sold[product] = (sold[product] || 0) + 1);
    }
    for(const [product, quantity] of sold.entries()) {
      if(quantity) {
        await client.query(SQL`
          INSERT INTO Inventory (product_id, user_con_id, quantity)
          SELECT ${product}, ${user_con_id}, quantity FROM Inventory
          WHERE user_id = ${user_id} AND product_id = ${product}
          ON CONFLICT DO NOTHING
        `);
        await client.query(SQL`
          UPDATE Inventory SET quantity = GREATEST(quantity - ${quantity}, 0)
          WHERE product_id = ${product} AND user_id = ${user_id}
        `);
      }
    }
    await client.query(SQL`COMMIT`);
  } catch(error) {
    await client.query(SQL`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
}

async function getUserProducts(user_id: number, includeDiscontinued: boolean = false): Promise<ca.Products> {
  const client = await connect();
  try {
    const { rows: raw_products } = await client.query<Pick<db.Product, 'product_id' | 'type_id' | 'name' | 'discontinued'>>(
      SQL`SELECT product_id, type_id, name, discontinued FROM Products WHERE user_id = ${user_id}`
        .append(includeDiscontinued ? SQL`` : SQL` AND discontinued = FALSE`)
        .append(SQL` ORDER BY product_id ASC`)
    );
    const { rows: raw_inventory } = await client.query<Pick<db.InventoryItem, 'quantity' | 'product_id'>>(
      SQL`SELECT quantity, product_id FROM Inventory WHERE user_id = ${user_id}`
    );
    const inventory = raw_inventory.map(_ => ({ id: _.product_id, quantity: _.quantity }));
    const products: ca.Products = raw_products.map(_ => ({ type: _.type_id, id: _.product_id, name: _.name, discontinued: _.discontinued, quantity: inventory.find(byId(_.product_id))!.quantity }));
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
    const { rows: raw_prices } = await client.query<Pick<db.Price, 'type_id' | 'product_id' | 'prices'>>(
      SQL`SELECT type_id, product_id, prices FROM Prices WHERE user_id = ${user_id} AND array_length(prices, 1) > 0`
    );
    const prices: ca.Prices = raw_prices.map(_ => ({ type: _.type_id, product: _.product_id, prices: _.prices}));
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
      SQL`SELECT type_id, name, color, discontinued FROM ProductTypes WHERE user_id = ${user_id}`
        .append(includeDiscontinued ? SQL`` : SQL` AND discontinued = FALSE`)
        .append(SQL` ORDER BY type_id ASC`)
    );
    const types = raw_types.map(_ => ({ id: _.type_id, name: _.name, color: _.color, discontinued: _.discontinued }));
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
    await client.query(SQL`BEGIN`);
    const result: ca.Products = [];
    for(const product of products) {
      switch(product.kind) {
        case 'create': {
          const { name, type, quantity } = product;
          const { rows: [{ product_id }]} = await client.query<Pick<db.Product, 'product_id'>>(
            SQL`INSERT INTO Products (name,type_id,user_id) VALUES (${name},${type},${user_id}) RETURNING product_id`
          );
          await client.query(
            SQL`INSERT INTO Inventory (quantity,product_id,user_id) VALUES (${quantity},${product_id},${user_id})`
          );
          result.push({ name, id: product_id, type, quantity, discontinued: false });
          break;
        }
        case 'modify': {
          const { id, name, quantity, discontinued } = product;
          await client.query(
            SQL`UPDATE Products SET name = ${name}, discontinued = ${discontinued} WHERE product_id = ${id} AND user_id = ${user_id}`
          );
          await client.query(
            SQL`UPDATE Inventory SET quantity = ${quantity} WHERE product_id = ${id} AND user_id = ${user_id}`
          );
          break;
        }
      }
    }
    await client.query(SQL`COMMIT`);
    return result;
  } catch(error) {
    await client.query(SQL`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
}

async function writePrices(user_id: number, prices: ca.PricesUpdate): Promise<ca.Prices> {
  const client = await connect();
  try {
    await client.query(SQL`BEGIN`);
    const result: ca.Prices = [];
    for(const { type_id, product_id, price } of prices) {
      const { rowCount } = await client.query(
        SQL`SELECT 1 FROM Prices WHERE user_id = ${user_id} AND type_id = ${type_id}`
          .append(product_id ? SQL` AND product_id = ${product_id}` : SQL` AND product_id IS NULL`)
      );
      if(rowCount === 1) {
        await client.query(
          SQL`UPDATE Prices SET prices = ${price} WHERE type_id = ${type_id} AND user_id = ${user_id}`
            .append(product_id ? SQL` AND product_id = ${product_id}` : SQL` AND product_id IS NULL`)
        );
      } else {
        await client.query(
          SQL`INSERT INTO Prices (prices,type_id,product_id,user_id) VALUES (${price},${type_id},${product_id},${user_id})`
        );
        result.push({ type: type_id, product: product_id, prices: price});
      }
    }
    await client.query(SQL`COMMIT`);
    return result;
  } catch(error) {
    await client.query(SQL`ROLLBACK`);
    throw error;
  } finally {
    client.release();
  }
}

async function writeTypes(user_id: number, types: ca.TypesUpdate): Promise<ca.ProductTypes> {
  const client = await connect();
  try {
    await client.query(SQL`BEGIN`);
    const result: ca.ProductTypes = [];
    for(const type of types) {
      switch(type.kind) {
        case 'create': {
          const { name, color } = type;
          const { rows: [{ type_id }] } = await client.query<Pick<db.ProductType, 'type_id'>>(
            SQL`INSERT INTO ProductTypes (user_id, name, color) VALUES (${user_id},${name},${color}) RETURNING type_id`
          );
          result.push({ id: type_id, name, color, discontinued: false });
          break;
        }
        case 'modify': {
          const { id, name, color, discontinued } = type;
            await client.query(
              SQL`UPDATE ProductTypes SET name = ${name}, color = ${color}, discontinued = ${discontinued} WHERE type_id = ${id} AND user_id = ${user_id}`
            );
          }
          break;
      }
    }
    await client.query(SQL`COMMIT`);
    return result;
  } catch(error) {
    await client.query(SQL`ROLLBACK`);
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
  const { rowCount } = await query(
    SQL`SELECT 1 FROM User_Conventions WHERE user_id = ${user_id}`
  );
  return { ...user, keys: user.keys - rowCount };
}

async function getConventions(page: number, limit: number): Promise<ca.MetaConvention[]> {
  const client = await connect();
  try {
    const { rows: raw_cons } = await query<Pick<db.Convention, 'code' | 'title' | 'start_date' | 'end_date'>>(
      SQL`SELECT code, title, start_date, end_date FROM Conventions WHERE start_date > ${new Date()} LIMIT ${limit} OFFSET ${page * limit}`
    );
    const cons = raw_cons.map(_ => ({
      type: 'meta' as 'meta',
      title: _.title,
      code: _.code,
      start: new Date(_.start_date),
      end: new Date(_.end_date),
    }));
    return cons;
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
  getUserTypes, writeTypes,
  getConventions, getUserMetaConventions, writeUserConventions,
  userExists, logInUser, createUser, getUser,
};
