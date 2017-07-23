import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StorageService } from './storage.service';

@Pipe({
  name: 'type',
  pure: false,
})
export class TypePipe implements PipeTransform {
  private types: BehaviorSubject<ca.ProductTypes>
  constructor(@Inject(StorageService) storage: StorageService) {
    this.types = storage.types;
  }

  transform<K extends keyof ca.ProductType>(id: number): ca.ProductType;
  transform<K extends keyof ca.ProductType>(id: number, prop: K): ca.ProductType[K];
  transform<K extends keyof ca.ProductType>(id: number, prop?: K) {
    const type = this.types.getValue().find(_ => _.id === id) || { name: 'Unknown Type', id: -1, color: 0xFFFFFF, discontinued: false };
    if(prop) {
      return type[prop];
    } else {
      return type;
    }
  }

  reverse(name: string): ca.ProductType {
    return this.types.getValue().find(_ => _.name === name) || { name: 'Unknown Type', id: -1, color: 0xFFFFFF, discontinued: false };
  }
}
