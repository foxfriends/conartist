import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdInputModule, MdCheckboxModule, MdToolbarModule, MdSidenavModule, MdListModule, MdIconModule, MdTooltipModule, MdTabsModule, MdProgressSpinnerModule, MdSnackBarModule, MdSlideToggleModule, MdDialogModule, MdMenuModule, MdGridListModule, MdTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

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
  MdTableModule,
  CdkTableModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export default class MaterialModule { }
