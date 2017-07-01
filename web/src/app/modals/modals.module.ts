import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import ChooseConventionComponent from './choose-convention.component';
import ChooseConventionService from './choose-convention.service';
import MaterialModule from '../material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule ],
  declarations: [ ChooseConventionComponent ],
  entryComponents: [ ChooseConventionComponent ],
  providers: [ ChooseConventionService ],
})
export default class ModelsModule { }
