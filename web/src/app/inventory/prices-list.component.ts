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
  @Input() type: ProductType;
  @Input() showDiscontinued: boolean = false;

  private _prices: BehaviorSubject<Prices>;

  readonly quantityIsNatural = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0 && parseInt(quantity, 10) === parseFloat(quantity);
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

  removePriceRow(index: number, product: number | null) {
    this._prices.next(
      this._prices.getValue()
        .map(_ => _.type === this.type.id && _.product === product ? { ..._, prices: _.prices.filter((_, i) => i !== index), dirty: true } : _)
        .filter(_ => ((_.product === null || _.product > 0) && _.type > 0) || _.prices.length > 0)
    );
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
