import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import DataModule from '../data/data.module';
import ModalsModule from '../modals/modals.module';

import ConventionsComponent from './conventions.component';
import ConInfoComponent from './con-info.component';
import ConListComponent from './con-list.component';
import RecordListComponent from './record-list.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule, DataModule, ModalsModule ],
  declarations: [ ConventionsComponent, ConListComponent, RecordListComponent, ConInfoComponent ],
  exports: [ ConventionsComponent ],
})
export default class ConventionsModule { }

export { default as ConventionsComponent } from './conventions.component';
