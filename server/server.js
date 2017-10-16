'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const tasks = require("./tasks");
const api_1 = require("./api");
const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    tasks.start();
});
app.use(bodyParser.json());
app.use('/api', api_1.default);
app.use('/', express.static(path.resolve(__dirname, '../web')));
app.use('/', (_, res) => res.sendFile(path.resolve(__dirname, '../web/index.html')));
