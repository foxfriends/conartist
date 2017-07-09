import { NgModule } from '@angular/core';
import StorageService from './storage.service';
import SaveService from './save.service';
import ColorPipe from './color.pipe';
import TypePipe from './type.pipe';
import ProductPipe from './product.pipe';
import ModalsModule from '../modals/modals.module';

@NgModule({
  imports: [ ModalsModule ],
  declarations: [ TypePipe, ProductPipe, ColorPipe ],
  providers: [ StorageService, SaveService, TypePipe, ProductPipe ],
  exports: [ TypePipe, ProductPipe, ColorPipe ],
})
export default class DataModule {}
