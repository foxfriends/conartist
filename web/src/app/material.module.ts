import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdInputModule, MdCheckboxModule } from '@angular/material';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';

const modules = [
  MdButtonModule,
  MdCardModule,
  MdInputModule,
  MdCheckboxModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export default class MaterialModule { }
