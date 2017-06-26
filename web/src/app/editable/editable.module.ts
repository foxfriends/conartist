import { NgModule } from '@angular/core';
import EditableDirective from './editable.directive';

@NgModule({
  declarations: [ EditableDirective ],
  exports: [ EditableDirective ],
})
export default class EditableModule { }
