import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import DashboardComponent from './dashboard.component';
import DashConventionsComponent from './dash-conventions.component';
import DashInventoryComponent from './dash-inventory.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
  ],
  declarations: [
    DashboardComponent,
    DashConventionsComponent,
    DashInventoryComponent,
  ],
  exports: [ DashboardComponent ],
})
export default class DashboardModule { }

export { default as DashboardComponent } from './dashboard.component';
