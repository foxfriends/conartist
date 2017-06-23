import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import MaterialModule from './material.module';
import SignInModule from './sign-in/sign-in.module';
import DashboardModule from './dashboard/dashboard.module';
import InventoryModule from './inventory/inventory.module';
import ConventionsModule from './conventions/conventions.module';

import AppComponent from './app.component';

import APIService from './api/api.service';
import StorageService from './storage/storage.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    SignInModule,
    DashboardModule,
    InventoryModule,
    ConventionsModule,
  ],
  declarations: [ AppComponent ],
  providers: [ APIService, StorageService ],
  bootstrap: [ AppComponent ],
})
export default class AppModule { }
