import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import ColorPickerComponent from './color-picker.component';
import MaterialModule from '../material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule ],
  declarations: [ ColorPickerComponent ],
  exports: [ ColorPickerComponent ],
})
export default class ColorPickerModule { }
