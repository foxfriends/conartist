import { TestBed } from '@angular/core/testing';

import { suite as describe, test as it } from 'mocha-typescript';
import { expect } from 'chai';

import { AppComponent } from './app.component';

@describe('App Component')
export class AppComponentTests {
  before() {
    return TestBed.configureTestingModule({ declarations: [ AppComponent ] }).compileComponents();
  }
  after() {}

  @it ['should exist'] () {
    expect(true).to.be.true;
  }
}
