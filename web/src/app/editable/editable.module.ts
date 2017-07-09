import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import MaterialModule from '../material.module';

import EditableDirective from './editable.directive';
import EditableComponent from './editable.component';

@NgModule({
  imports: [ MaterialModule, FormsModule ],
  declarations: [ EditableDirective, EditableComponent ],
  exports: [ EditableDirective, EditableComponent ],
})
export default class EditableModule { }
