import { Component, Input, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';
import template from './product-list.component.html';
import styles from './product-list.component.scss';
import { Products, Prices, ProductType } from '../../../../conartist';

@Component({
  selector: 'con-product-list',
  template: template,
  styles: [ styles ],
})
export default class ProductListComponent {
  @Input() type: ProductType;
  @Input() showDiscontinued = false;

  private _products: BehaviorSubject<Products>;
  private _prices: BehaviorSubject<Prices>;

  readonly productNameIsUnique = (name: string) => !this._products.getValue().filter(_ => _.type === this.type.id && _.name === name).length;
  readonly quantityIsPositive = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) >= 0 && parseInt(quantity, 10) === parseFloat(quantity);

  constructor(@Inject(StorageService) storage: StorageService) {
    this._products = storage.products;
    this._prices = storage.prices;
  }

  get products() {
    return this._products.getValue().filter(_ => _.type === this.type.id && (this.showDiscontinued || !_.discontinued));
  }

  // TODO: move these modifier methods to the storage service
  setProductName(name: string, product: number) {
    this._products.next(this._products.getValue().map(_ => _.id === product ? { ..._, name, dirty: true } : _));
  }

  setProductQuantity(quantity: string, product: number) {
    this._products.next(this._products.getValue().map(_ => _.id === product ? { ..._, quantity: parseInt(quantity, 10), dirty: true } : _));
  }

  setProductDiscontinued(discontinued: boolean, product: number) {
    const before = this._products.getValue().length;
    this._products.next(
      this._products.getValue()
        .map(_ => _.id === product ? { ..._, discontinued, dirty: true } : _)
        .filter(_ => _.id >= 0 || !_.discontinued)
    );

    if(before > this._products.getValue().length) {
      this._prices.next(
        this._prices.getValue().filter(
          _ => _.type !== this.type.id || _.product !== product
        )
      )
    }
  }

  addPriceRow(type: number, product: number | null = null) {
    const prices = this._prices.getValue();
    const existing = prices.find(_ => _.type === type && _.product === product);
    if(existing) {
      const extended = existing.prices.sort((a, b) => a[0] - b[0]);
      extended.push([ (extended[extended.length - 1] || [0])[0] + 1, 0 ]);
      this._prices.next(prices.map(_ => _ === existing ? { ...existing, prices: extended, dirty: true } : _))
    } else {
      this._prices.next([
        ...prices,
        { type, product, prices: [ [1, 0] ], dirty: true },
      ]);
    }
  }
}
