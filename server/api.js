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
const db = require("./database");
const JWT = require("jsonwebtoken");
const api = express();
const JWTSecret = 'FAKE_SECRET_KEY';
function assert_authorized(req, user_id) {
    const auth = req.get('authorization');
    if (!auth) {
        throw new Error('No authorization');
    }
    const { usr } = JWT.verify(auth, JWTSecret);
    if (usr !== user_id) {
        throw new Error('Incorrect credentials');
    }
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
api.post('/auth/:user_id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id } = req.params;
        assert_authorized(req, user_id);
        const jwt = JWT.sign({ usr: user_id }, JWTSecret, { expiresIn: '30 days' });
        res.send(JSON.stringify({ status: 'Success', data: jwt }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/:user_id/con/:con_code/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id, con_code } = req.params;
        assert_authorized(req, user_id);
        const data = yield db.getConInfo(user_id, con_code);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/user/:user_id/con/:con_code/sales/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id, con_code } = req.params;
        assert_authorized(req, user_id);
        const { records } = req.body;
        yield db.writeRecords(user_id, con_code, records);
        res.send(JSON.stringify({ status: 'Success' }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/:user_id/products/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id } = req.params;
        assert_authorized(req, user_id);
        const data = yield db.getUserProducts(user_id);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/user/:user_id/products/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id } = req.params;
        assert_authorized(req, user_id);
        const data = yield db.getUserProducts(user_id);
        res.send(JSON.stringify({ status: 'Success', data }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.get('/user/:user_id/prices/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id } = req.params;
        assert_authorized(req, user_id);
        const { products } = req.body;
        yield db.writeProducts(user_id, products);
        res.send(JSON.stringify({ status: 'Success' }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
api.put('/user/:user_id/prices/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    try {
        const { user_id } = req.params;
        assert_authorized(req, user_id);
        const { prices } = req.body;
        yield db.writePrices(user_id, prices);
        res.send(JSON.stringify({ status: 'Success' }));
    }
    catch (error) {
        console.error(error);
        res.send(JSON.stringify({ status: 'Error', error: error.message }));
    }
}));
exports.default = api;
