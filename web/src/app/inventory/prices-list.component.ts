import { Component, Input } from '@angular/core';

import template from './prices-list.component.html';
import styles from './prices-list.component.scss';
import { Prices } from '../../../../conartist';

@Component({
  selector: 'con-prices-list',
  template: template,
  styles: [ styles ],
})
export default class PricesListComponent {
  @Input('prices')
  private _prices: Prices;

  get prices(): Prices {
    return this._prices.sort((a, b) => a.product === null ? -1 : (b.product === null ? 1 : a.product - b.product));
  }
}
