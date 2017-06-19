import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import DashboardComponent from './dashboard.component';
import DashConventionsComponent from './dash-conventions.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [
    DashboardComponent,
    DashConventionsComponent,
  ],
  exports: [DashboardComponent],
})
export default class DashboardModule { }
