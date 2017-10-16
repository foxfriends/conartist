'use strict';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as tasks from './tasks';

import api from './api';

const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server is listening on port ${PORT}`);
  tasks.start();
});
app.use(bodyParser.json());
app.use('/api', api);

app.use('/', express.static(path.resolve(__dirname, '../web')));
app.use('/', (_, res) => res.sendFile(path.resolve(__dirname, '../web/index.html')));
