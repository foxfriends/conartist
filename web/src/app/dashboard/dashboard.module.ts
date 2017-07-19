import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { DashConventionsComponent } from './dash-conventions.component';
import { DashInventoryComponent } from './dash-inventory.component';
import { MaterialModule } from '../material.module';
import { ModalsModule } from '../modals/modals.module';
import { ConventionsModule } from '../conventions/conventions.module';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ModalsModule,
    ConventionsModule,
  ],
  declarations: [
    DashboardComponent,
    DashConventionsComponent,
    DashInventoryComponent,
  ],
  exports: [ DashboardComponent ],
})
export class DashboardModule { }
