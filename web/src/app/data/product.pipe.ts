import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Products, Product } from '../../../../conartist';
import StorageService from './storage.service';

@Pipe({
  name: 'product',
  pure: false,
})
export default class ProductPipe implements PipeTransform {
  private products: BehaviorSubject<Products>;

  constructor(@Inject(StorageService) storage: StorageService) {
    this.products = storage.products;
  }

  transform<K extends keyof Product>(id: number): Product;
  transform<K extends keyof Product>(id: number, prop: K): Product[K];
  transform<K extends keyof Product>(id: number, prop?: K) {
    const product = this.products.getValue().find(_ => _.id === id) || { name: '', type: -1, id: -1, quantity: 0, discontinued: false };
    if(prop) {
      return product[prop];
    } else {
      return product;
    }
  }
}
