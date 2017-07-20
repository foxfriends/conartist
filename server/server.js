'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const api_1 = require("./api");
const app = express();
app.listen(process.env.PORT || 8080, () => {
    console.log('Server is listening on port 8080');
});
app.use(bodyParser.json());
app.use('/api', api_1.default);
app.use('/test/', (_, res) => res.sendFile(path.resolve('../web/dist/test.html')));
app.use('/', express.static('../web/dist'));
app.use('/', (_, res) => res.sendFile(path.resolve('../web/dist/index.html')));
