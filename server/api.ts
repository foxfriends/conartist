import * as express from 'express';

import ca from '../conartist';
import * as db from './database';
import * as JWT from 'jsonwebtoken';

const api = express();

const JWTSecret = 'FAKE_SECRET_KEY';

api.post('/auth/', async (req, res) => {
  res.header('Content-Type: application/json');
  const { usr, psw } = req.body;
  try {
    const { user_id } = await db.logInUser(usr, psw);
    const jwt = JWT.sign({ usr: user_id } as object, JWTSecret, { expiresIn: '30 days' });
    res.send(JSON.stringify({ status: 'Success', data: jwt } as ca.APISuccessResult<string>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/user/:user_id/con/:con_code/', async (req, res) => {
  res.header('Content-Type: application/json');
  try {
    const { user_id, con_code } = req.params;
    const data = await db.getConInfo(user_id, con_code);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Convention>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.put('/user/:user_id/con/:con_code/sale/', async (req, res) => {
  res.header('Content-Type: application/json');
  try {
    const { user_id, con_code } = req.params;
    const { records } = req.body;
    await db.writeRecords(user_id, con_code, records);
    res.send(JSON.stringify({ status: 'Success' } as ca.APISuccessResult<void>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

api.get('/user/:user_id/products/', async (req, res) => {
  res.header('Content-Type: application/json');
  try {
    const { user_id } = req.params;
    const data = await db.getUserProducts(user_id);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Products>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});
api.get('/user/:user_id/prices/', async (req, res) => {
  res.header('Content-Type: application/json');
  try {
    const { user_id } = req.params;
    const data = await db.getUserPrices(user_id);
    res.send(JSON.stringify({ status: 'Success', data } as ca.APISuccessResult<ca.Prices>));
  } catch(error) {
    console.error(error);
    res.send(JSON.stringify({ status: 'Error', error: error.message } as ca.APIErrorResult));
  }
});

export default api;
