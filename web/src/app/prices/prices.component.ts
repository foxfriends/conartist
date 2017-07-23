import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdSort, Sort } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/toPromise';

import { ProductPipe } from '../data/product.pipe';
import { TypePipe } from '../data/type.pipe';
import { ConDataSource } from '../data/data-source';
import { StorageService } from '../data/storage.service';
import template from './prices.component.html';
import styles from './prices.component.scss';

type ColumnName = 'product' | 'type' | 'quantity' | 'price' | 'delete';

type Row = {
  index: number;
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
  readonly displayedColumns: ColumnName[] = ['type', 'product', 'quantity', 'price', 'delete'];
  private _prices = this.storage.prices;
  dataSource = new ConDataSource<Row>(
    this._prices.map(
      _ => ([] as Row[]).concat(
        ..._.map(
          ({ product, type, prices }) => prices.map(
            ([quantity, price], index) => ({ index, product, type, quantity, price })
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
    setTimeout(() => { // HACK: delay this so that the filter gets applied from the start
      this.dataSource.filter = row => {
        const productDiscontinued = row.product ? this.product.transform(row.product).discontinued : false;
        const typeDiscontinued = this.type.transform(row.type).discontinued;
        return !(productDiscontinued || typeDiscontinued);
      };
    })
    this.sort.mdSortChange.subscribe((sort: Sort) => {
      let fn: ((a: Row, b: Row) => number) | null = null;
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

  exportPricesData() {
    // TODO: allow for customizing the format of generated files
    const header = 'Type,Product,Quantity,Price\n';
    const data = ([] as Row[]).concat(...this._prices.getValue()
      .map(({ product, type, prices }) => prices.map(
          ([quantity, price], index) => ({ index, product, type, quantity, price })
        )
      ))
      .map(_ => `${this.type.transform(_.type).name},${_.product ? this.product.transform(_.product).name : 'None'},${_.quantity},${_.price}\n`)
    saveAs(
      new Blob([header, ...data], { type: 'text/csv;charset=utf-8' }),
      'conartist-prices.csv',
      true
    );
  }

  async importPricesData() {
    const input: HTMLInputElement = document.createElement('INPUT') as HTMLInputElement;
    input.setAttribute('type', 'file');
    input.click();
    await Observable.fromEvent(input, 'change').take(1).toPromise();
    if(input.files && input.files[0]) {
      const file = input.files[0];
      const fr = new FileReader();
      fr.readAsText(file);
      await Observable.fromEvent(fr, 'loadend').take(1).toPromise();
      const values = (fr.result as string)
        .split('\n')
        .filter(_ => !!_)
        .map(_ => _.split(',') .map(_ => _.trim())) as [string, string, string, string][];
      // TODO: handle different row configurations
      const set = values
        .reduce(([...set], [ type, product, quantity, price ]) => {
          if(isNaN(parseInt(quantity, 10))) { return set; }
          if(isNaN(parseFloat(price.replace(/^\$/, '')))) { return set; }
          const qty = +quantity;
          const prc = parseFloat(price.replace(/^\$/, ''));
          const prd = (product === 'None' ? null : this.product.reverse(product).id)
          const typ = this.type.reverse(type).id;
          const i = set.findIndex(_ => _.type === typ && _.product === prd);
          if(i === -1) {
            set.push({ type: typ, product: prd, prices: [[qty, prc]]});
          } else {
            set[i] = { ...set[i], prices: [...set[i].prices, [qty, prc]]};
          }
          return set;
        }, [] as ca.Prices);
      set.forEach(price => this.storage.setPriceList(price.type, price.product, price.prices));
    }
  }

  addRow() {
    // nooop
  }

  // TODO: this is duplicated in the PricesListComponent
  setQuantity(quantity: string, type: number, product: number | null, index: number) {
    this.storage.setPriceQuantity(type, product, index, parseInt(quantity, 10));
  }
  setPrice(price: string, type: number, product: number | null, index: number) {
    this.storage.setPricePrice(type, product, index, parseFloat(price.replace(/^\$/, '')));
  }
  removeRow(type: number, product: number, index: number) {
    this.storage.removePriceRow(type, product, index);
  }
  readonly quantityIsNatural = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0 && parseInt(quantity, 10) === parseFloat(quantity);
  readonly priceIsPositive = (price: string) => !isNaN(parseFloat(price.replace(/^\$/, ''))) && parseFloat(price.replace(/^\$/, '')) >= 0;
}
