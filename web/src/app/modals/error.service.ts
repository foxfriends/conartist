import { Injectable, Inject } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import ErrorComponent from './error.component';

@Injectable()
export default class ErrorService {
  constructor(@Inject(MdDialog) private dialog: MdDialog) { }

  open(error: Error): Observable<void> {
    return this.dialog.open(ErrorComponent, { data: error, width: '400px', panelClass: 'error' }).afterClosed();
  }
}
