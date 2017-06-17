import * as express from 'express';

import ca from '../conartist';
import * as db from './database';
import * as JWT from 'jsonwebtoken';

const api = express();

const JWTSecret = 'FAKE_SECRET_KEY';

type AuthToken = { usr: number; };
type JWT = string;

type Params = {
  user_id: number;
  con_code: string;
  usr: string;
};

type Body = {
  records: ca.RecordsUpdate;
  prices: ca.PricesUpdate;
  products: ca.ProductsUpdate;
  usr: string;
  psw: string;
};

function assert_authorized(req: express.Request, user_id: number): void {
  const auth: JWT = req.get('authorization');
  if(!auth) { throw new Error('No authorization'); }
  const { usr } = JWT.verify(auth, JWTSecret) as AuthToken;
  if(usr !== user_id) { throw new Error('Incorrect credentials'); }
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

api.post('/auth/:user_id', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id } = req.params as Pick<Params, 'user_id'>;
    assert_authorized(req, user_id);
    const jwt = JWT.sign({ usr: user_id } as AuthToken, JWTSecret, { expiresIn: '30 days' });
    res.send(JSON.stringify({ status: 'Success', data: jwt } as ca.APISuccessResult<string>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/user/:user_id/con/:con_code/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id, con_code } = req.params as Pick<Params, 'user_id' | 'con_code'>;
    assert_authorized(req, user_id);
    const data = await db.getConInfo(user_id, con_code);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Convention>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/user/:user_id/con/:con_code/sales/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id, con_code } = req.params as Pick<Params, 'user_id' | 'con_code'>;
    assert_authorized(req, user_id);
    const { records } = req.body as Pick<Body, 'records'>;
    await db.writeRecords(user_id, con_code, records);
    res.send(JSON.stringify({ status: 'Success' } as ca.APISuccessResult<void>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/user/:user_id/products/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id } = req.params as Pick<Params, 'user_id'>;
    assert_authorized(req, user_id);
    const data = await db.getUserProducts(user_id);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Products>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/user/:user_id/products/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id } = req.params as Pick<Params, 'user_id'>;
    assert_authorized(req, user_id);
    const data = await db.getUserProducts(user_id);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Products>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/user/:user_id/prices/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id } = req.params as Pick<Params, 'user_id'>;
    assert_authorized(req, user_id);
    const { products } = req.body as Pick<Body, 'products'>;
    await db.writeProducts(user_id, products);
    res.send(JSON.stringify({ status: 'Success' } as ca.APISuccessResult<void>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/user/:user_id/prices/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    const { user_id } = req.params as Pick<Params, 'user_id'>;
    assert_authorized(req, user_id);
    const { prices } = req.body as Pick<Body, 'prices'>;
    await db.writePrices(user_id, prices);
    res.send(JSON.stringify({ status: 'Success' } as ca.APISuccessResult<void>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

export default api;
