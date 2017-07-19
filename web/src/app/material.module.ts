import { NgModule } from '@angular/core';
import { MdButtonModule, MdCardModule, MdInputModule, MdCheckboxModule, MdToolbarModule, MdSidenavModule, MdListModule, MdIconModule, MdTooltipModule, MdTabsModule, MdProgressSpinnerModule, MdSnackBarModule, MdSlideToggleModule, MdDialogModule, MdMenuModule, MdGridListModule, MdTableModule, MdSortModule } from '@angular/material';
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
  MdSortModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
