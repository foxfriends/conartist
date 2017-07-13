import { NgModule } from '@angular/core';
import BroadcastService from './broadcast.service';

@NgModule({
  providers: [ BroadcastService ],
})
export default class BroadcastModule {}

export { default as ConEvent } from './event';
