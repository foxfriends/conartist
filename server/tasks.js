'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = require("node-schedule");
const Observable_1 = require("rxjs/Observable");
const db = require("./database");
require("rxjs/add/observable/bindCallback");
const daily = Observable_1.Observable.bindCallback(node_schedule_1.scheduleJob.bind(null, '0 0 0 * * *'));
function start() {
    daily().subscribe(db.startConventions);
}
exports.start = start;
