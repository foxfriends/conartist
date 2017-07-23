import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StorageService } from './storage.service';

@Pipe({
  name: 'product',
  pure: false,
})
export class ProductPipe implements PipeTransform {
  private products: BehaviorSubject<ca.Products>;

  constructor(@Inject(StorageService) storage: StorageService) {
    this.products = storage.products;
  }

  transform<K extends keyof ca.Product>(id: number): ca.Product;
  transform<K extends keyof ca.Product>(id: number, prop: K): ca.Product[K];
  transform<K extends keyof ca.Product>(id: number, prop?: K) {
    const product = this.products.getValue().find(_ => _.id === id) || { name: '', type: -1, id: -1, quantity: 0, discontinued: false };
    if(prop) {
      return product[prop];
    } else {
      return product;
    }
  }

  reverse(name: string): ca.Product {
    return this.products.getValue().find(_ => _.name === name) || { name: '', type: -1, id: -1, quantity: 0, discontinued: false };
  }
}
