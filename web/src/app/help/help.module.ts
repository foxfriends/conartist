import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import AbsoluteViewboxDirective from './absolute-viewbox.directive';
import HelpComponent from './help.component';
import HelpArrowDirective from './help-arrow.directive';
import HelpTextDirective from './help-text.directive';
import HelpOutlineDirective from './help-outline.directive';
import HelpService from './help.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ HelpComponent, AbsoluteViewboxDirective, HelpArrowDirective, HelpTextDirective, HelpOutlineDirective ],
  providers: [ HelpService ],
  exports: [ HelpComponent, HelpArrowDirective, HelpTextDirective, HelpOutlineDirective ],
})
export default class HelpModule {}
