import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MdSort, Sort, MdSelectChange } from '@angular/material';
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

@Component({
  selector: 'con-pricing',
  template: template,
  styles: [ styles ],
})
export class PricesComponent implements OnInit {
  readonly displayedColumns: ColumnName[] = ['type', 'product', 'quantity', 'price', 'delete'];
  private readonly __prices = this.storage.prices;
  private readonly _prices = this.__prices.map(_ => _.filter(_ => _.price >= 0));
  private readonly _types = this.storage.types;
  private readonly _products = this.storage.products;
  dataSource = new ConDataSource(this._prices, row => {
    const productDiscontinued = row.product ? this.product.transform(row.product).discontinued : false;
    const typeDiscontinued = this.type.transform(row.type).discontinued;
    return !(productDiscontinued || typeDiscontinued);
  });
  @ViewChild(MdSort) sort: MdSort;

  get types() {
    return this._types.getValue();
  }

  products(type: number) {
    return this._products.getValue().filter(_ => _.type === type);
  }

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ProductPipe) private product: ProductPipe,
    @Inject(TypePipe) private type: TypePipe,
  ) {}

  ngOnInit() {
    this.sort.mdSortChange.subscribe((sort: Sort) => {
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

  exportPricesData() {
    // TODO: allow for customizing the format of generated files
    const header = 'Type,Product,Quantity,Price\n';
    this._prices
      .map(data => data.map(_ => `${this.type.transform(_.type).name},${_.product ? this.product.transform(_.product).name : 'None'},${_.quantity},${_.price}\n`))
      .subscribe(data => {
        saveAs(
          new Blob([header, ...data], { type: 'text/csv;charset=utf-8' }),
          'conartist-prices.csv',
          true
        );
      });
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
      values
        .forEach(([ type, product, quantity, price ]) => {
          if(isNaN(parseInt(quantity, 10))) { return; }
          if(isNaN(parseFloat(price.replace(/^\$/, '')))) { return; }
          const qty = parseInt(quantity, 10);
          const prc = parseFloat(price.replace(/^\$/, ''));
          const prd = product === 'None' ? null : this.product.reverse(product).id;
          const typ = this.type.reverse(type).id;
          const exists = this.__prices.getValue().find(_ => _.type === typ && _.product === prd && _.quantity === qty);
          if(exists) {
            this.storage.setPricePrice(exists.index, prc);
          } else {
            this.storage.addPriceRow(typ, prd, qty, prc);
          }
        }, [] as ca.Prices);
    }
  }

  addRow() {
    this.storage.addPriceRow(this.types[0].id);
  }

  setType(type: MdSelectChange, index: number) {
    this.storage.setPriceType(index, type.value);
  }
  setProduct(product: MdSelectChange, index: number) {
    this.storage.setPriceProduct(index, product.value);
  }
  // TODO: this is duplicated in the PricesListComponent
  setQuantity(quantity: string, index: number) {
    this.storage.setPriceQuantity(index, parseInt(quantity, 10));
  }
  setPrice(price: string, index: number) {
    this.storage.setPricePrice(index, parseFloat(price.replace(/^\$/, '')));
  }
  removeRow(index: number) {
    this.storage.removePriceRow(index);
  }
  readonly quantityIsNatural = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0 && parseInt(quantity, 10) === parseFloat(quantity);
  readonly priceIsPositive = (price: string) => !isNaN(parseFloat(price.replace(/^\$/, ''))) && parseFloat(price.replace(/^\$/, '')) >= 0;
}
