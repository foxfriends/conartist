import { NgModule } from '@angular/core';
import { StorageService } from './storage.service';
import { SaveService } from './save.service';
import { ColorPipe } from './color.pipe';
import { TypePipe } from './type.pipe';
import { ProductPipe } from './product.pipe';
import { APIModule } from '../api/api.module';
import { BroadcastModule } from '../broadcast/broadcast.module';
import { ModalsModule } from '../modals/modals.module';

@NgModule({
  imports: [ ModalsModule, APIModule, BroadcastModule ],
  declarations: [ TypePipe, ProductPipe, ColorPipe ],
  providers: [ StorageService, SaveService, TypePipe, ProductPipe ],
  exports: [ TypePipe, ProductPipe, ColorPipe ],
})
export class DataModule {}
