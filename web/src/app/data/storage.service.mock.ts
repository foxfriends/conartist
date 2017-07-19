import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';
import { APIServiceMock } from '../api/api.service.mock';
import { ErrorServiceMock } from '../modals/error.service.mock';

@Injectable()
class StorageServiceMock extends StorageService {
  constructor() {
    super(
      APIServiceMock,
      { open() { return {}; } } as any,
      ErrorServiceMock,
      {
        filter() {
          return { subscribe(cb: () => void) { return cb(); } };
        }
      } as any
    );
  }

  reset() {
    super.reset();
    APIServiceMock.getUserInfo().subscribe(_ => {
      this.email.next(_.email);
      this.keys.next(_.keys);
      this.products.next(_.products);
      this.prices.next(_.prices);
      this.types.next(_.types);
      this.conventions.next(_.conventions);
    });
  }
}

const mock = new StorageServiceMock;
export { mock as StorageServiceMock };
export { StorageService } from './storage.service';
