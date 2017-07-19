import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { SignInModule } from './sign-in/sign-in.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InventoryModule } from './inventory/inventory.module';
import { ConventionsModule } from './conventions/conventions.module';
import { HelpModule } from './help/help.module';
import { DataModule } from './data/data.module';
import { RoutingModule } from './routing/routing.module';

import { AppComponent } from './app.component';

import { APIModule } from './api/api.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    DataModule,
    SignInModule,
    DashboardModule,
    InventoryModule,
    ConventionsModule,
    HelpModule,
    APIModule,
    RoutingModule,
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
