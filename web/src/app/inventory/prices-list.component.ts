import { Component, Input } from '@angular/core';

import template from './prices-list.component.html';
import styles from './prices-list.component.scss';
import { Prices, Price } from '../../../../conartist';

@Component({
  selector: 'con-prices-list',
  template: template,
  styles: [ styles ],
})
export default class PricesListComponent {
  @Input('prices')
  private _prices: Prices;

  get prices(): [string, Price][] {
    return Object.keys(this._prices)
      .sort()
      .map(_ => [_, this._prices[_].sort(([a], [b]) => a - b)] as [string, Price]);
  }
}
