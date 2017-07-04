import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import DataModule from '../data/data.module';
import ModalsModule from '../modals/modals.module';

import ConventionsComponent from './conventions.component';
import ConListComponent from './con-list.component';
import ConInfoComponent from './con-info.component';
import RecordListComponent from './record-list.component';
import ConInventoryComponent from './con-inventory.component';
import ConPricingComponent from './con-pricing.component';
import StatsComponent from './stats.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule, DataModule, ModalsModule ],
  declarations: [ ConventionsComponent, ConListComponent, RecordListComponent, ConInfoComponent, StatsComponent, ConInventoryComponent, ConPricingComponent ],
  exports: [ ConventionsComponent ],
})
export default class ConventionsModule { }

export { default as ConventionsComponent } from './conventions.component';
