import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdInputModule, MdCheckboxModule, MdToolbarModule, MdSidenavModule, MdListModule, MdIconModule, MdTooltipModule, MdTabsModule, MdProgressSpinnerModule, MdSnackBarModule, MdSlideToggleModule, MdDialogModule, MdMenuModule, MdGridListModule } from '@angular/material';

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
  MdTabsModule,
  MdProgressSpinnerModule,
  MdSnackBarModule,
  MdSlideToggleModule,
  MdDialogModule,
  MdMenuModule,
  MdGridListModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export default class MaterialModule { }
