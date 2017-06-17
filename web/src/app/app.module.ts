import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import SignInModule from './sign-in/sign-in.module';
import DashboardModule from './dashboard/dashboard.module';

import AppComponent from './app.component';

import APIService from './api/api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SignInModule,
    DashboardModule,
  ],
  providers: [ APIService ],
  bootstrap: [ AppComponent ],
})
export default class AppModule { }
