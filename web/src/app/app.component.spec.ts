import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from 'chai';

import AppComponent from './app.component';

@Component({
  selector: 'con-sign-in',
  template: '',
})
class SignInComponent {}

type Context = {
  fixture: ComponentFixture<AppComponent>;
  component: AppComponent;
};

describe('App Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Configure the module', () => TestBed.configureTestingModule({ declarations: [ AppComponent, SignInComponent ] }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(AppComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  });

  it('should be created', () => {
    expect(this.component).not.to.be.undefined;
  });
});
