import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { By } from '@angular/platform-browser';

import { expect } from 'chai';

import APIServiceMock, { APIService } from './api/api.service.mock';
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

describe.skip('App Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'conventions', component: ConventionsComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/sign-in' },
  ];
  before('Clear the authtoken', () => localStorage.removeItem('authtoken'));
  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    imports: [ MaterialModule, RouterTestingModule.withRoutes(routes) ],
    declarations: [ AppComponent, SignInComponent, DashboardComponent, InventoryComponent, ConventionsComponent ],
    providers: [ { provide: APIService, useValue: APIServiceMock } ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(AppComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
    this.page = new Page(this.fixture);
  });

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
