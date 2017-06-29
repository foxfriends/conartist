import { Component, Input, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';
import template from './prices-list.component.html';
import styles from './prices-list.component.scss';
import { Price, Prices, ProductType } from '../../../../conartist';

@Component({
  selector: 'con-prices-list',
  template: template,
  styles: [ styles ],
})
export default class PricesListComponent {
  @Input('type') type: ProductType;
  private _prices: BehaviorSubject<Prices>;

  readonly quantityIsPositive = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0;
  readonly priceIsPositive = (price: string) => !isNaN(parseFloat(price.replace(/^\$/,''))) && parseFloat(price.replace(/^\$/,'')) >= 0;

  constructor(@Inject(StorageService) storage: StorageService) {
    this._prices = storage.prices;
  }

  setPriceQuantity(quantity: string, index: number, product: number | null) {
    this._prices.next(
      this._prices
        .getValue()
        .map(
          _ => _.type === this.type.id && _.product === product
            ? {
              ..._,
              prices: _.prices.map(([q, p], i) => [index === i ? parseInt(quantity, 10) : q, p]),
              dirty: true,
            } : _
        ));
  }

  setPricePrice(price: string, index: number, product: number | null) {
    this._prices.next(
      this._prices
        .getValue()
        .map(
          _ => _.type === this.type.id && _.product === product
            ? {
              ..._,
              prices: _.prices.map(([q, p], i) => [q, index === i ? Math.round(100 * parseFloat(price.replace(/^\$/,''))) / 100 : p]),
              dirty: true,
            } : _
        ));
  }

  get prices(): Prices {
    return this._prices.getValue()
      .filter(_ => _.type === this.type.id)
      .sort((a, b) => (a.product !== null ? a.product : -Infinity) - (b.product !== null ? b.product : -Infinity));
  }

  trackProduct(price: Price) {
    return price.product;
  }
}
