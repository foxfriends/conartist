import * as express from 'express';
import * as JWT from 'jsonwebtoken';
import * as eJWT from 'express-jwt';

import * as ca from '../conartist';
import * as db from './database';

const api = express();

const JWTSecret = 'FAKE_SECRET_KEY' + Date.now();

type AuthToken = { usr: number; };
type JWT = string;

type Params = {
  con_code: string;
  usr: string;
};

type User = {
  usr: number;
}

type Body = {
  records: ca.RecordsUpdate;
  prices: ca.PricesUpdate;
  products: ca.ProductsUpdate;
  usr: string;
  psw: string;
};

function assert_authorized() {
  return eJWT({ secret: JWTSecret });
}

// TODO: less repetition of res.set
// TODO: figure out how to work with caching instead of try to disable it

api.post('/account/new/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  const { usr, psw } = req.body as Pick<Body, 'usr' | 'psw'>;
  try {
    await db.createUser(usr, psw);
    res.send(JSON.stringify({ status: 'Success' } as ca.APISuccessResult<void>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/account/exists/:usr', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  const { usr } = req.params as Pick<Params, 'usr'>;
  try {
    const exists = await db.userExists(usr);
    res.send(JSON.stringify({ status: 'Success', data: exists } as ca.APISuccessResult<boolean>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.post('/auth/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  const { usr, psw } = req.body as Pick<Body, 'usr' | 'psw'>;
  try {
    const { user_id } = await db.logInUser(usr, psw);
    const jwt: JWT = JWT.sign({ usr: user_id } as AuthToken, JWTSecret, { expiresIn: '30 days' });
    res.send(JSON.stringify({ status: 'Success', data: jwt } as ca.APISuccessResult<JWT>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/auth/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { usr: user_id } = req.user as User;
    const jwt = JWT.sign({ usr: user_id } as AuthToken, JWTSecret, { expiresIn: '30 days' });
    res.send(JSON.stringify({ status: 'Success', data: jwt } as ca.APISuccessResult<string>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/user/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { usr: user_id } = req.user as User;
    // TODO: concurrency
    const { email, keys } = await db.getUser(user_id);
    const products = await db.getUserProducts(user_id);
    const prices = await db.getUserPrices(user_id);
    const types = await db.getUserTypes(user_id);
    const conventions = await db.getUserMetaConventions(user_id);
    const data = { email, keys, products, prices, types, conventions };
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.UserInfo>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/con/:con_code/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { con_code } = req.params as Pick<Params, 'con_code'>;
    const { usr: user_id } = req.user as User;
    const data = await db.getConInfo(user_id, con_code);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.FullConvention>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/con/:con_code/sales/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { con_code } = req.params as Pick<Params, 'con_code'>;
    const { usr: user_id } = req.user as User;
    const { records } = req.body as Pick<Body, 'records'>;
    await db.writeRecords(user_id, con_code, records);
    res.send(JSON.stringify({ status: 'Success' } as ca.APISuccessResult<void>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/products/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { usr: user_id } = req.user as User;
    const data = await db.getUserProducts(user_id);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Products>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/products/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { usr: user_id } = req.user as User;
    const { products } = req.body as Pick<Body, 'products'>
    const data = await db.writeProducts(user_id, products);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Products>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/prices/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { usr: user_id } = req.user as User;
    const data = await db.getUserPrices(user_id);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Prices>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/prices/', assert_authorized(), async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { usr: user_id } = req.user as User;
    const { prices } = req.body as Pick<Body, 'prices'>;
    const data = await db.writePrices(user_id, prices);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Prices>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

export default api;
