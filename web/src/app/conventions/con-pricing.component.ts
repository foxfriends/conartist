import { Component, Input, Inject } from '@angular/core';

import ConDataSource from '../data/data-source';
import StorageService from '../data/storage.service';
import template from './con-pricing.component.html';
import styles from './con-pricing.component.scss';
import { FullConvention } from '../../../../conartist';

type ColumnName = 'product' | 'type' | 'quantity' | 'price';

type Row = {
  product: number | null;
  type: number;
  quantity: number;
  price: number;
};

@Component({
  selector: 'con-con-pricing',
  template: template,
  styles: [ styles ],
})
export default class ConPricingComponent {
  readonly displayedColumns: ColumnName[] = ['type', 'product', 'quantity', 'price'];
  @Input() con: FullConvention;
  private _prices = this.storage.prices;
  dataSource = new ConDataSource<Row>(
    this._prices.map(
      _ => ([] as Row[]).concat(
        ..._.map(
          ({ product, type, prices }) => prices.map(
            _ => ({ product, type, quantity: _[0], price: _[1] })
          )
        )
      )
    )
  );

  constructor(@Inject(StorageService) private storage: StorageService) {}
}
