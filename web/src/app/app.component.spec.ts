import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { expect } from 'chai';

import AppComponent from './app.component';
import MaterialModule from './material.module';

type Context = {
  authtoken: string | null;
  fixture: ComponentFixture<AppComponent>;
  component: AppComponent;
};

describe('App Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  @Component({ selector: 'con-sign-in', template: '' }) class SignInComponent {}
  @Component({ selector: 'con-dashboard', template: '' }) class DashboardComponent {}

  before('Store the existing authtoken', () => {
    this.authtoken = localStorage.getItem('authtoken');
    localStorage.removeItem('authtoken');
  });
  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    imports: [ MaterialModule ],
    declarations: [ AppComponent, SignInComponent, DashboardComponent ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(AppComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  });
  after('Restore the existing authtoken', () => this.authtoken && localStorage.setItem('authtoken', this.authtoken));

  it('should show the sign in page when the user is not signed in', () => {
    const signIn = this.fixture.debugElement.query(By.css('con-sign-in'));
    const dashboard = this.fixture.debugElement.query(By.css('con-dashboard'));
    expect(signIn, 'the sign in component should exist').not.to.be.null;
    expect(dashboard, 'the dashboard component should not exist').to.be.null;
  });

  it('should show the dashboard after a user signs in', () => {
    this.fixture.debugElement.query(By.css('con-sign-in')).triggerEventHandler('signIn', null);
    this.fixture.detectChanges();
    const signIn = this.fixture.debugElement.query(By.css('con-sign-in'));
    const dashboard = this.fixture.debugElement.query(By.css('con-dashboard'));
    expect(signIn, 'the sign in component should not exist').to.be.null;
    expect(dashboard, 'the dashboard component should exist').not.to.be.null;
  });
});
