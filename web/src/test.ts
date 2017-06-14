import 'core-js/es6';
import 'core-js/es7/reflect';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/mocha-patch';

import { use } from 'chai';
import * as promised from 'chai-as-promised';
use(promised);

import * as testing from '@angular/core/testing';
import * as browser from '@angular/platform-browser-dynamic/testing';

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

import './app/app.component.spec';
