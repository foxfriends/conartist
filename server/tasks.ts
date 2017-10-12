'use strict';
import { scheduleJob } from 'node-schedule';
import { Observable } from 'rxjs/Observable';
import * as db from './database';
import 'rxjs/add/observable/bindCallback';

const daily = Observable.bindCallback(scheduleJob.bind(null, '0 0 0 * * *'));
export function start() {
    daily().subscribe(db.startConventions);
}
