import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseConventionComponent } from './choose-convention.component';
import { ChooseConventionService } from './choose-convention.service';
import { ErrorComponent } from './error.component';
import { ErrorService } from './error.service';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule ],
  declarations: [ ChooseConventionComponent, ErrorComponent ],
  entryComponents: [ ChooseConventionComponent, ErrorComponent ],
  providers: [ ChooseConventionService, ErrorService ],
})
export class ModalsModule {}
