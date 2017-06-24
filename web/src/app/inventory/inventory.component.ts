import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import StorageService from '../storage/storage.service';
import template from './inventory.component.html';
import styles from './inventory.component.scss';
import { Products, ProductTypes, ProductTypeName, Prices } from '../../../../conartist';

@Component({
  selector: 'con-inventory',
  template: template,
  styles: [ styles ],
})
export default class InventoryComponent {
  private _products: Observable<Products>
  private _types: Observable<ProductTypes>
  private _prices: Observable<Prices>;
  constructor(@Inject(StorageService) storage: StorageService) {
    this._products = storage.products;
    this._types = storage.types;
    this._prices = storage.prices;
  }

  get types() {
    // TODO: what order should types come in? save an order in the database?
    return this._types.map(_ => Object.values(_));
  }

  products(type: ProductTypeName) {
    return this._products.map(_ => _[type]);
  }

  prices(type: ProductTypeName) {
    return this._prices.map(_ =>
      Object
        .entries(_)
        .filter(([_]) => _.split('::')[0] === type)
        .reduce((_, [n, v]) => ({ ..._, [n]: v }), {} as Prices)
    );
  }
}
