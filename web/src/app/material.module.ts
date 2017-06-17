import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdInputModule, MdCheckboxModule, MdToolbarModule } from '@angular/material';

const modules = [
  MdButtonModule,
  MdCardModule,
  MdInputModule,
  MdCheckboxModule,
  MdToolbarModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export default class MaterialModule { }
