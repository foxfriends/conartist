import { Injectable, Inject } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import ChooseConventionComponent from './choose-convention.component';
import { MetaConvention } from '../../../../conartist';

@Injectable()
export default class ChooseConventionService {
  constructor(@Inject(MdDialog) private dialog: MdDialog) { }

  open(): Observable<MetaConvention> {
    return this.dialog.open(ChooseConventionComponent, { width: '800px' }).afterClosed();
  }
}
