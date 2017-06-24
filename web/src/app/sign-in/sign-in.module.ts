import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import SignInComponent from './sign-in.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [SignInComponent],
  exports: [SignInComponent],
})
export default class SignInModule { }

export { default as SignInComponent } from './sign-in.component';
