import { NgModule } from '@angular/core';
import StorageService from './storage.service';
import ColorPipe from './color.pipe';
import TypePipe from './type.pipe';
import ProductPipe from './product.pipe';

@NgModule({
  declarations: [ TypePipe, ProductPipe, ColorPipe ],
  providers: [ StorageService ],
  exports: [ TypePipe, ProductPipe, ColorPipe ],
})
export default class DataModule {}
