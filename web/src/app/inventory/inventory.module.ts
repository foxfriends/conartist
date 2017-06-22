import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import MaterialModule from '../material.module';
import ColorModule from '../color/color.module';
import InventoryComponent from './inventory.component';
import ProductListComponent from './product-list.component';

@NgModule({
  imports: [ MaterialModule, CommonModule, ColorModule ],
  declarations: [ InventoryComponent, ProductListComponent ],
  exports: [ InventoryComponent ],
})
export default class InventoryModule { }
