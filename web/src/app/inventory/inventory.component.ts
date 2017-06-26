import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';
import template from './inventory.component.html';
import styles from './inventory.component.scss';
import { Products, ProductTypes, ID, Prices } from '../../../../conartist';

@Component({
  selector: 'con-inventory',
  template: template,
  styles: [ styles ],
})
export default class InventoryComponent {
  private _products: BehaviorSubject<Products>
  private _types: BehaviorSubject<ProductTypes>
  private _prices: BehaviorSubject<Prices>;
  constructor(@Inject(StorageService) storage: StorageService) {
    this._products = storage.products;
    this._types = storage.types;
    this._prices = storage.prices;
  }

  get types() {
    // TODO: what order should types come in? save an order in the database?
    return this._types.getValue();
  }

  products(type: ID) {
    return this._products.getValue().filter(_ => _.type === type);
  }

  prices(type: ID) {
    return this._prices.getValue().filter(_ => _.type === type);
  }

  tabChange(index: number) {
    const max = Object.keys(this._types.getValue()).length;
    if(index === max) {
      this._types.next({
        ...this._types.getValue(),
        [`Type ${index}`]: {
          name: `Type ${index}`,
          color: [255, 255, 255],
          id: 'new',
          discontinued: false,
        }
      });
    }
  }
}
