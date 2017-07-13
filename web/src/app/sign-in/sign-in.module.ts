import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import BroadcastModule from '../broadcast/broadcast.module';
import SignInComponent from './sign-in.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, BroadcastModule],
  declarations: [SignInComponent],
  exports: [SignInComponent],
})
export default class SignInModule { }
