import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import MaterialModule from '../material.module';
import DataModule from '../data/data.module';
import EditableModule from '../editable/editable.module';
import ColorPickerModule from '../color-picker/color-picker.module';
import HelpModule from '../help/help.module';

import InventoryComponent from './inventory.component';
import ProductListComponent from './product-list.component';
import PricesListComponent from './prices-list.component';

@NgModule({
  imports: [ CommonModule, FormsModule, MaterialModule, EditableModule, DataModule, ColorPickerModule, HelpModule ],
  declarations: [ InventoryComponent, ProductListComponent, PricesListComponent ],
  exports: [ InventoryComponent ],
})
export default class InventoryModule { }
