import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import SignInModule from './sign-in/sign-in.module';

import AppComponent from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SignInModule,
  ],
  bootstrap: [AppComponent]
})
export default class AppModule { }
