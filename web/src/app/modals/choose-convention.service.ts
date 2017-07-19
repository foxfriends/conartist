import { Injectable, Inject } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { ChooseConventionComponent } from './choose-convention.component';

@Injectable()
export class ChooseConventionService {
  constructor(@Inject(MdDialog) private dialog: MdDialog) { }

  open(): Observable<ca.MetaConvention | undefined> {
    return this.dialog.open(ChooseConventionComponent, { width: '800px' }).afterClosed();
  }
}
