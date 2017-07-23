import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/mocha-patch';

import { use } from 'chai';

import * as promised from 'chai-as-promised';
import * as sinon from 'sinon-chai';
use(promised);
use(sinon);

import { TestBed, } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

import './app/app.module.spec';
import './util/index.spec.ts';
