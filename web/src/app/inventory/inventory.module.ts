import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import MaterialModule from '../material.module';
import ColorModule from '../color/color.module';
import InventoryComponent from './inventory.component';

@NgModule({
  imports: [ MaterialModule, CommonModule, ColorModule ],
  declarations: [ InventoryComponent ],
  exports: [ InventoryComponent ],
})
export default class InventoryModule { }
