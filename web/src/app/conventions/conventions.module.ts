import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import ConventionsComponent from './conventions.component';
import ConListComponent from './con-list.component';
import RecordListComponent from './record-list.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule ],
  declarations: [ ConventionsComponent, ConListComponent, RecordListComponent ],
  exports: [ ConventionsComponent ],
})
export default class ConventionsModule { }

export { default as ConventionsComponent } from './conventions.component';
