import { Component, Input, Inject, ViewChild, OnInit } from '@angular/core';
import { MdSort, Sort } from '@angular/material';

import { StorageService } from '../data/storage.service';
import { TypePipe } from '../data/type.pipe';
import { ConDataSource } from '../data/data-source';

import template from './con-inventory.component.html';
import styles from './con-inventory.component.scss';

type ColumnName = 'selected' | 'name' | 'type' | 'quantity';

@Component({
  selector: 'con-con-inventory',
  template: template,
  styles: [ styles ],
})
export class ConInventoryComponent implements OnInit {
  readonly displayedColumns: ColumnName[] = ['name', 'type', 'quantity'];
  @Input() con: ca.FullConvention;
  private _products = this.storage.products;
  dataSource: ConDataSource<ca.Product>;
  @ViewChild(MdSort) sort: MdSort;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(TypePipe) private type: TypePipe,
  ) {}

  ngOnInit() {
    this.dataSource = new ConDataSource(this._products);
    this.dataSource.filter = _ => (!_.discontinued && !this.type.transform(_.type).discontinued) || this.included(_);
    this.sort.sortChange.subscribe((sort: Sort) => {
      let fn: ((a: ca.Product, b: ca.Product) => number) | undefined;
      if(sort.direction && sort.active) {
        const dir = sort.direction === 'asc' ? -1 : 1;
        switch(sort.active as ColumnName) {
          case 'selected':
            fn = (a, b) => (+this.included(a) - +this.included(b)) * dir;
            break;
          case 'name':
            fn = (a, b) => (a.name < b.name ? 1 : -1) * dir;
            break;
          case 'type':
            fn = (a, b) => (this.type.transform(a.type).name < this.type.transform(b.type).name ? 1 : -1) * dir;
            break;
          case 'quantity':
            fn = (a, b) => (a.quantity - b.quantity) * dir;
            break;
        }
      }
      this.dataSource.sort = fn;
    });
  }

  included({ id }: ca.Product): boolean {
    return !!this.con.data.products.find(_ => _.id === id && !_.discontinued);
  }

  toggleIncluded(product: ca.Product) {
    if(this.included(product)) {
      this.storage.removeConventionProduct(this.con, product);
    } else {
      this.storage.addConventionProduct(this.con, product);
    }
  }
}
