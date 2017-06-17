'use strict';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import api from './api';

const app = express();
app.listen(process.env.PORT || 8080, () => {
  // tslint:disable-next-line
  console.log('Server is listening on port 8080');
});
app.use(bodyParser.json());
app.use('/api', api);
app.use('/', express.static('../web/dist'));
