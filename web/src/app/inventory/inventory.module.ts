import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import MaterialModule from '../material.module';
import InventoryComponent from './inventory.component';

@NgModule({
  imports: [ MaterialModule, CommonModule ],
  declarations: [ InventoryComponent ],
  exports: [ InventoryComponent ],
})
export default class InventoryModule { }
