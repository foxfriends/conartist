import { Component, Input, Inject } from '@angular/core';

import { ConDataSource } from '../data/data-source';
import { StorageService } from '../data/storage.service';
import template from './prices-list.component.html';
import styles from './prices-list.component.scss';

type ColumnName = 'product' | 'type' | 'quantity' | 'price' | 'delete';

@Component({
  selector: 'con-prices-list',
  template: template,
  styles: [ styles ],
})
export class PricesListComponent {
  @Input() type: ca.ProductType;
  @Input() showDiscontinued = false;

  readonly displayedColumns: ColumnName[] = ['type', 'product', 'quantity', 'price', 'delete'];
  private readonly _prices = this.storage.prices;
  dataSource = new ConDataSource(this._prices, row => row.type === this.type.id && row.price >= 0, (a, b) => ((a.product || 0) - (b.product || 0)));

  readonly quantityIsNatural = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0 && parseInt(quantity, 10) === parseFloat(quantity);
  readonly priceIsPositive = (price: string) => !isNaN(parseFloat(price.replace(/^\$/, ''))) && parseFloat(price.replace(/^\$/, '')) >= 0;

  constructor(@Inject(StorageService) private storage: StorageService) {}

  setQuantity(quantity: string, index: number) {
    this.storage.setPriceQuantity(index, parseInt(quantity, 10));
  }

  setPrice(price: string, index: number) {
    this.storage.setPricePrice(index, parseFloat(price.replace(/^\$/, '')));
  }

  removeRow(index: number) {
    this.storage.removePriceRow(index);
  }

  get prices(): ca.SimplePrices {
    return this._prices.getValue()
      .filter(_ => _.type === this.type.id && _.price >= 0)
      .sort((a, b) => (a.product !== null ? a.product : -Infinity) - (b.product !== null ? b.product : -Infinity));
  }

  trackProduct(price: ca.Price) {
    return price.product;
  }
}
