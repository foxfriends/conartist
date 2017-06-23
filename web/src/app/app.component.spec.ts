import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { expect } from 'chai';

import AppComponent from './app.component';
import MaterialModule from './material.module';

@Component({ selector: 'con-sign-in', template: '' }) class SignInComponent {}
@Component({ selector: 'con-dashboard', template: '' }) class DashboardComponent {}
@Component({ selector: 'con-inventory', template: '' }) class InventoryComponent {}
@Component({ selector: 'con-conventions', template: '' }) class ConventionsComponent {}

class Page {
  constructor(private fixture: ComponentFixture<AppComponent>) {}
  get signIn() { return this.fixture.debugElement.query(By.css('con-sign-in')); }
  get dashboard() { return this.fixture.debugElement.query(By.css('con-dashboard')); }
  get inventory() { return this.fixture.debugElement.query(By.css('con-inventory')); }
  get conventions() { return this.fixture.debugElement.query(By.css('con-conventions')); }
}

type Context = {
  authtoken: string | null;
  fixture: ComponentFixture<AppComponent>;
  component: AppComponent;
  page: Page;
};

describe('App Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  before('Store the existing authtoken', () => {
    this.authtoken = localStorage.getItem('authtoken');
    localStorage.removeItem('authtoken');
  });
  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    imports: [ MaterialModule ],
    declarations: [ AppComponent, SignInComponent, DashboardComponent, InventoryComponent, ConventionsComponent ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(AppComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
    this.page = new Page(this.fixture);
  });
  after('Restore the existing authtoken', () => this.authtoken && localStorage.setItem('authtoken', this.authtoken));

  it('should show the sign in page when the user is not signed in', () => {
    expect(this.page.signIn, 'the sign in component should exist').not.to.be.null;
    expect(this.page.dashboard, 'the dashboard component should not exist').to.be.null;
    expect(this.page.inventory, 'the inventory component should not exist').to.be.null;
    expect(this.page.conventions, 'the conventions component should not exist').to.be.null;
  });

  it('should show the dashboard after a user signs in', () => {
    this.fixture.debugElement.query(By.css('con-sign-in')).triggerEventHandler('signIn', null);
    this.fixture.detectChanges();
    expect(this.page.signIn, 'the sign in component should not exist').to.be.null;
    expect(this.page.dashboard, 'the dashboard component should exist').not.to.be.null;
    expect(this.page.inventory, 'the inventory component should not exist').to.be.null;
    expect(this.page.conventions, 'the conventions component should not exist').to.be.null;
  });

  it('should show the inventory when the inventory page is chosen', () => {
    this.fixture.debugElement.query(By.css('con-sign-in')).triggerEventHandler('signIn', null);
    this.fixture.debugElement.queryAll(By.css('md-list-item'))[1].triggerEventHandler('click', null);
    this.fixture.detectChanges();
    expect(this.page.signIn, 'the sign in component should not exist').to.be.null;
    expect(this.page.dashboard, 'the dashboard component should not exist').to.be.null;
    expect(this.page.inventory, 'the inventory component should exist').not.to.be.null;
    expect(this.page.conventions, 'the conventions component should not exist').to.be.null;
  });

  it('should show the conventions when the conventions page is chosen', () => {
    this.fixture.debugElement.query(By.css('con-sign-in')).triggerEventHandler('signIn', null);
    this.fixture.debugElement.queryAll(By.css('md-list-item'))[2].triggerEventHandler('click', null);
    this.fixture.detectChanges();
    expect(this.page.signIn, 'the sign in component should not exist').to.be.null;
    expect(this.page.dashboard, 'the dashboard component should not exist').to.be.null;
    expect(this.page.inventory, 'the inventory component should not exist').to.be.null;
    expect(this.page.conventions, 'the conventions component should exist').not.to.be.null;
  });
});
