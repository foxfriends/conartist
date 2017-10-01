import { Component, Input, Inject, OnInit, ViewChild } from '@angular/core';
import { MdSort, Sort } from '@angular/material';

import { ProductPipe } from '../data/product.pipe';
import { TypePipe } from '../data/type.pipe';
import { ConDataSource } from '../data/data-source';
import { StorageService } from '../data/storage.service';
import template from './con-pricing.component.html';
import styles from './con-pricing.component.scss';

type ColumnName = 'product' | 'type' | 'quantity' | 'price';

@Component({
  selector: 'con-con-pricing',
  template: template,
  styles: [ styles ],
})
export class ConPricingComponent implements OnInit {
  readonly displayedColumns: ColumnName[] = ['type', 'product', 'quantity', 'price'];
  @Input() con: ca.FullConvention;
  private _prices = this.storage.prices;
  dataSource = new ConDataSource(this._prices);
  @ViewChild(MdSort) sort: MdSort;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ProductPipe) private product: ProductPipe,
    @Inject(TypePipe) private type: TypePipe,
  ) {}

  ngOnInit() {
    this.dataSource.filter = row => {
      const productDiscontinued = row.product ? this.product.transform(row.product).discontinued : false;
      const typeDiscontinued = this.type.transform(row.type).discontinued;
      const conPrice = this.con.data.prices.find(_ => _.type === row.type && _.product === row.product);
      return !!conPrice || !(productDiscontinued || typeDiscontinued);
    }
    this.sort.sortChange.subscribe((sort: Sort) => {
      let fn: ((a: ca.SimplePrice, b: ca.SimplePrice) => number) | undefined;
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
