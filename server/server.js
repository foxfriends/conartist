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
if (process.argv[2] === 'elm') {
    app.use('/', express.static(path.resolve(__dirname, '../web-elm')));
    app.use('/', (_, res) => res.sendFile(path.resolve(__dirname, '../web-elm/index.html')));
}
else {
    app.use('/test/', (_, res) => res.sendFile(path.resolve(__dirname, '../web/dist/test.html')));
    app.use('/', express.static(path.resolve(__dirname, '../web/dist')));
    app.use('/', (_, res) => res.sendFile(path.resolve(__dirname, '../web/dist/index.html')));
}
