import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from 'chai';

import SignInComponent from './sign-in.component';

type Context = {
  fixture: ComponentFixture<SignInComponent>;
  component: SignInComponent;
};

describe('Sign In Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Configure the module', () => TestBed.configureTestingModule({ declarations: [ SignInComponent ] }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(SignInComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  });

  it('should be created', () => {
    expect(this.component).not.to.be.undefined;
  });
});
