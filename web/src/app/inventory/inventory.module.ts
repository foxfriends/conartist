import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import MaterialModule from '../material.module';
import ColorModule from '../color/color.module';
import EditableModule from '../editable/editable.module';
import InventoryComponent from './inventory.component';
import ProductListComponent from './product-list.component';
import PricesListComponent from './prices-list.component';

@NgModule({
  imports: [ CommonModule, MaterialModule, ColorModule, EditableModule ],
  declarations: [ InventoryComponent, ProductListComponent, PricesListComponent ],
  exports: [ InventoryComponent ],
})
export default class InventoryModule { }

export { default as InventoryComponent } from './inventory.component';
