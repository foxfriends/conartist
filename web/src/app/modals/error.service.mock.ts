import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import ErrorService from './error.service';

@Injectable()
class ErrorServiceMock extends ErrorService {
  constructor() {
    super({} as any);
  }
  open(): Observable<void> { return Observable.of(); }
}

export default new ErrorServiceMock;
export { default as ErrorService } from './error.service';
