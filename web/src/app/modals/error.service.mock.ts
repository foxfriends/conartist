import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ErrorService } from './error.service';

@Injectable()
class ErrorServiceMock extends ErrorService {
  constructor() {
    super({} as any);
  }
  open(): Observable<void> { return Observable.of(); }
}

const mock = new ErrorServiceMock;
export { mock as ErrorServiceMock };
export { ErrorService } from './error.service';
