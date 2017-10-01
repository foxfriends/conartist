import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatInputModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatTooltipModule, MatTabsModule, MatProgressSpinnerModule, MatSnackBarModule, MatSlideToggleModule, MatDialogModule, MatMenuModule, MatGridListModule, MatTableModule, MatSortModule, MatPaginatorModule, MatSelectModule } from '@angular/material';

const modules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatTooltipModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatMenuModule,
  MatGridListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSelectModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule { }
