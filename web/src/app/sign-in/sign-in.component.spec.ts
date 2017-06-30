import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect } from 'chai';
import { spy } from 'sinon';
import * as lolex from 'lolex';
import { wait } from '../../util';

import SignInComponent from './sign-in.component';
import MaterialModule from '../material.module';
import APIServiceMock, { APIService, existingUser, newUser } from '../api/api.service.mock';

type Context = {
  fixture: ComponentFixture<SignInComponent>;
  component: SignInComponent;
};

describe('Sign In Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  class RouterMock {
    static navigate = spy();
  }

  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    imports: [ NoopAnimationsModule, MaterialModule, ReactiveFormsModule ],
    declarations: [ SignInComponent ],
    providers: [
      { provide: APIService, useValue: APIServiceMock },
      { provide: Router, useValue: RouterMock },
    ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(SignInComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  });
  afterEach('Reset the router spy', () => RouterMock.navigate.reset());

  it('should disable the sign in button until all fields are filled', () => {
    const button = this.fixture.debugElement.query(By.css('button')).nativeElement;

    expect(this.component.signInForm.valid, 'the form should start invalid').to.be.false;
    expect(button.disabled, 'the button should start disabled').to.be.ok;

    this.component.signInForm.patchValue({ email: existingUser.email });
    this.fixture.detectChanges();
    expect(this.component.signInForm.valid, 'the form should be invalid with just an email').to.be.false;
    expect(button.disabled, 'the button should be disabled with just an email').to.be.ok;

    this.component.signInForm.patchValue({ password: existingUser.password, email: '' });
    this.fixture.detectChanges();
    expect(this.component.signInForm.valid, 'the form should be invalid with just a password').to.be.false;
    expect(button.disabled, 'the button should be disabled with just a password').to.be.ok;

    this.component.signInForm.patchValue(existingUser);
    this.fixture.detectChanges();
    expect(this.component.signInForm.valid, 'the form should be valid when filled').to.be.true;
    expect(button.disabled, 'the button should be enabled with both email and password').to.be.not.ok;
  });

  it('should route to the dashboard when sign in succeeds', async () => {
    this.component.signInForm.patchValue(existingUser);
    this.component.processSignIn();
    await wait();
    expect(RouterMock.navigate).to.have.been.calledWith(['/dashboard']);
  });

  it('should not route to the dashboard when sign in fails', async () => {
    this.component.signInForm.patchValue(newUser);
    this.component.processSignIn();
    await wait();
    expect(RouterMock.navigate).not.to.have.been.called;
  });

  it('should switch to the sign up menu and back when sign up button is pressed', () => {
    expect(this.component.isSignUpMode, 'it should start in sign in mode').to.be.false;

    const toSignUp = this.fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    toSignUp.triggerEventHandler('click', null);
    expect(this.component.isSignUpMode, 'it should switch to sign up mode').to.be.true;

    const toSignIn = this.fixture.debugElement.query(By.css('button:nth-of-type(2)'));
    toSignIn.triggerEventHandler('click', null);
    expect(this.component.isSignUpMode, 'it should switch back to sign in mode').to.be.false;
  });

  it('should auto-fill the sign up form when switching from the sign in form', () => {
    this.component.signInForm.patchValue(newUser);
    expect(this.component.signUpForm.value, 'email and password should be set').to.include(newUser);
    expect(this.component.signUpForm.value, 'only email and password should be set').to.deep.equal({
      ...newUser,
      confirmEmail: '',
      confirmPassword: '',
      termsAccepted: false,
    });
  });

  it('should ensure that new accounts use a new email', () => {
    const clock = lolex.install();
    this.component.signUpForm.patchValue({ email: newUser.email });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.email.valid, 'a new email should be valid').to.be.true;
    this.component.signUpForm.patchValue({ email: existingUser.email });
    this.fixture.detectChanges();
    clock.next();
    expect(this.component.signUpForm.controls.email.valid, 'an existing email should be invalid').to.be.false;
    clock.uninstall();
  });

  it('should ensure that email and confirm email must match', () => {
    this.component.signUpForm.patchValue({ email: newUser.email });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.confirmEmail.valid, 'an empty confirm email should be invalid').to.be.false;

    this.component.signUpForm.patchValue({ confirmEmail: newUser.email });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.confirmEmail.valid, 'a matching confirm email should be valid').to.be.true;

    this.component.signUpForm.patchValue({ email: existingUser.email });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.confirmEmail.valid, 'a non matching confirm email should be invalid').to.be.false;
  });

  it('should ensure that password and confirm password must match', () => {
    this.component.signUpForm.patchValue({ password: newUser.password });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.confirmPassword.valid, 'an empty confirm password should be invalid').to.be.false;

    this.component.signUpForm.patchValue({ confirmPassword: newUser.password });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.confirmPassword.valid, 'a matching confirm password should be valid').to.be.true;

    this.component.signUpForm.patchValue({ password: existingUser.password });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.confirmPassword.valid, 'a non matching confirm password should be invalid').to.be.false;
  });

  it('should require that the terms and conditions are accepted', () => {
    expect(this.component.signUpForm.controls.termsAccepted.value, 'it should start unchecked').to.be.false;
    expect(this.component.signUpForm.controls.termsAccepted.valid, 'it should be invalid when unchecked').to.be.false;
    this.component.signUpForm.patchValue({ termsAccepted: true });
    this.fixture.detectChanges();
    expect(this.component.signUpForm.controls.termsAccepted.valid, 'it should be valid when checked').to.be.true;
  });

  it('should enable the sign up button when the sign up form is filled correctly', () => {
    const clock = lolex.install();
    this.component.signUpForm.patchValue({
      ...newUser,
      termsAccepted: true,
    });
    this.fixture.detectChanges();
    this.component.signUpForm.patchValue({
      confirmEmail: newUser.email,
      confirmPassword: newUser.password,
    });
    this.fixture.detectChanges();
    clock.next();
    const button = this.fixture.debugElement.query(By.css('button')).nativeElement;
    expect(this.component.signUpForm.valid, 'the form should be valid').to.be.true;
    expect(button.disabled, 'the button should be enabled').to.be.ok;
    clock.uninstall();
  });
});
