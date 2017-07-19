import { NgModule } from '@angular/core';
import { BroadcastService } from './broadcast.service';

@NgModule({
  providers: [ BroadcastService ],
})
export class BroadcastModule {}

export { ConEvent } from './event';
