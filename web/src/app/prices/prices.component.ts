import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdSort, Sort } from '@angular/material';

import { ProductPipe } from '../data/product.pipe';
import { TypePipe } from '../data/type.pipe';
import { ConDataSource } from '../data/data-source';
import { StorageService } from '../data/storage.service';
import template from './prices.component.html';
import styles from './prices.component.scss';

type ColumnName = 'product' | 'type' | 'quantity' | 'price';

type Row = {
  product: number | null;
  type: number;
  quantity: number;
  price: number;
};

@Component({
  selector: 'con-pricing',
  template: template,
  styles: [ styles ],
})
export class PricesComponent implements OnInit {
  readonly displayedColumns: ColumnName[] = ['type', 'product', 'quantity', 'price'];
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
  @ViewChild(MdSort) sort: MdSort;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ProductPipe) private product: ProductPipe,
    @Inject(TypePipe) private type: TypePipe,
  ) {}

  ngOnInit() {
    this.dataSource.filter = row => {
      const price = this._prices.getValue().find(_ => _.type === row.type && _.product === row.product);
      const productDiscontinued = price && price.product ? this.product.transform(price.product).discontinued : false;
      const typeDiscontinued = price && this.type.transform(price.type).discontinued;
      return !(productDiscontinued || typeDiscontinued);
    }
    this.sort.mdSortChange.subscribe((sort: Sort) => {
      let fn: (a: Row, b: Row) => number = () => 0;
      if(sort.direction && sort.active) {
        const dir = sort.direction === 'asc' ? -1 : 1;
        switch(sort.active as ColumnName) {
          case 'type':
            fn = (a, b) => (this.type.transform(a.type).name < this.type.transform(b.type).name ? 1 : -1) * dir;
            break;
          case 'product':
            fn = (a, b) => ((
              (a.product ? this.product.transform(a.product).name : 0) <
              (b.product ? this.product.transform(b.product).name : 0)
            ) ? 1 : -1) * dir;
            break;
          case 'price':
            fn = (a, b) => (a.price - b.price) * dir;
            break;
          case 'quantity':
            fn = (a, b) => (a.quantity - b.quantity) * dir;
            break;
        }
      }
      this.dataSource.sort = fn;
    });
  }
}
