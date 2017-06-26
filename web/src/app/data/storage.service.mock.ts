import { Injectable } from '@angular/core';

import StorageService from './storage.service';
import APIServiceMock from '../api/api.service.mock';

@Injectable()
class StorageServiceMock extends StorageService {
  constructor() {
    super(APIServiceMock);
  }
}

export default new StorageServiceMock;
export { default as StorageService } from './storage.service';
