import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import MaterialModule from './material.module';
import SignInModule, { SignInComponent } from './sign-in/sign-in.module';
import DashboardModule, { DashboardComponent } from './dashboard/dashboard.module';
import InventoryModule, { InventoryComponent } from './inventory/inventory.module';
import ConventionsModule, { ConventionsComponent } from './conventions/conventions.module';

import AppComponent from './app.component';

import APIService from './api/api.service';
import StorageService from './storage/storage.service';

@NgModule({
  imports: [
    RouterModule.forRoot(AppModule.routes),
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
export default class AppModule {
  static routes: Routes = [
    { path: '', component: SignInComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'conventions', component: ConventionsComponent },
  ];
}
