import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdInputModule, MdCheckboxModule, MdToolbarModule, MdSidenavModule, MdListModule, MdIconModule, MdTooltipModule } from '@angular/material';

const modules = [
  MdButtonModule,
  MdCardModule,
  MdInputModule,
  MdCheckboxModule,
  MdToolbarModule,
  MdSidenavModule,
  MdListModule,
  MdIconModule,
  MdTooltipModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export default class MaterialModule { }
