"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const JWT = require("jsonwebtoken");
const eJWT = require("express-jwt");
const db = require("./database");
const api = express();
const JWTSecret = 'FAKE_SECRET_KEY';
function assert_authorized() {
    return eJWT({ secret: JWTSecret });
}
api.post('/account/new/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const { usr, psw } = req.body;
    try {
        yield db.createUser(usr, psw);
        res.send(JSON.stringify({ status: 'Success' }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/account/exists/:usr', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const { usr } = req.params;
    try {
        const exists = yield db.userExists(usr);
        res.send(JSON.stringify({ status: 'Success', data: exists }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.post('/auth/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    const { usr, psw } = req.body;
    try {
        const { user_id } = yield db.logInUser(usr, psw);
        const jwt = JWT.sign({ usr: user_id }, JWTSecret, { expiresIn: '30 days' });
        res.send(JSON.stringify({ status: 'Success', data: jwt }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.post('/auth/:user_id', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { usr: user_id } = req.user;
        const jwt = JWT.sign({ usr: user_id }, JWTSecret, { expiresIn: '30 days' });
        res.send(JSON.stringify({ status: 'Success', data: jwt }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { usr: user_id } = req.user;
        const { email, keys } = yield db.getUser(user_id);
        const products = yield db.getUserProducts(user_id);
        const prices = yield db.getUserPrices(user_id);
        const types = yield db.getUserTypes(user_id);
        const conventions = yield db.getUserMetaConventions(user_id);
        const data = { email, keys, products, prices, types, conventions };
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/`con/:con_code/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { con_code } = req.params;
        const { usr: user_id } = req.user;
        const data = yield db.getConInfo(user_id, con_code);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/`con/:con_code/sales/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { con_code } = req.params;
        const { usr: user_id } = req.user;
        const { records } = req.body;
        yield db.writeRecords(user_id, con_code, records);
        res.send(JSON.stringify({ status: 'Success' }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/products/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { usr: user_id } = req.user;
        const data = yield db.getUserProducts(user_id);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/products/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { usr: user_id } = req.user;
        const { products } = req.body;
        const data = yield db.writeProducts(user_id, products);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/prices/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { usr: user_id } = req.user;
        const data = yield db.getUserPrices(user_id);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/prices/', assert_authorized(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { usr: user_id } = req.user;
        const { prices } = req.body;
        const data = yield db.writePrices(user_id, prices);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
exports.default = api;