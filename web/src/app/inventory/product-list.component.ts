import { Component, Input, Inject, OnInit, OnChanges, ViewChild, SimpleChanges } from '@angular/core';
import { MdSort, Sort } from '@angular/material';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ConDataSource } from '../data/data-source';
import { StorageService } from '../data/storage.service';
import template from './product-list.component.html';
import styles from './product-list.component.scss';
type ColumnName = 'name' | 'quantity' | 'discontinue' | 'price';

function sortProductsById({id: a}: ca.Product, {id: b}: ca.Product): number {
  if(a > 0 && b < 0) {
    return -1;
  } else if(a < 0 && b > 0) {
    return 1;
  } else {
    return Math.abs(a) - Math.abs(b);
  }
}

@Component({
  selector: 'con-product-list',
  template: template,
  styles: [ styles ],
})
export class ProductListComponent implements OnInit, OnChanges {
  @ViewChild(MdSort) sort: MdSort;
  @Input() type: ca.ProductType;
  products: BehaviorSubject<ca.Products> = this.storage.products;
  dataSource = new ConDataSource(
    this.products.map(_ => _.filter(_ => _.type === this.type.id)),
    undefined,
    sortProductsById,
  );
  readonly displayedColumns: ColumnName[] = ['name', 'quantity', 'discontinue', 'price'];

  private _showDiscontinued = false;
  get showDiscontinued() { return this._showDiscontinued; }
  @Input() set showDiscontinued(value) {
    this._showDiscontinued = value;
    if(this._showDiscontinued) {
      this.dataSource.filter = undefined;
    } else {
      this.dataSource.filter = _ => !_.discontinued;
    }
  }

  constructor(@Inject(StorageService) private storage: StorageService) {}

  ngOnInit() {
    this.sort.mdSortChange.subscribe((sort: Sort) => {
      let fn: ((a: ca.Product, b: ca.Product) => number) | undefined;
      if(sort.direction && sort.active) {
        const dir = sort.direction === 'asc' ? -1 : 1;
        switch(sort.active as ColumnName) {
          case 'discontinue':
            fn = (a, b) => (+a.discontinued - +b.discontinued) * dir;
            break;
          case 'name':
            fn = (a, b) => (a.name < b.name ? 1 : -1) * dir;
            break;
          case 'quantity':
            fn = (a, b) => (a.quantity - b.quantity) * dir;
            break;
        }
      }
      this.dataSource.sort = fn;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.type) {
      const prevFilter = this.dataSource.filter;
      this.dataSource = new ConDataSource(this.products.map(_ => _.filter(_ => _.type === this.type.id)), undefined, sortProductsById);
      this.dataSource.filter = prevFilter;
    }
  }

  setProductName(name: string, product: number) {
    this.storage.setProductName(product, name);
  }

  setProductQuantity(quantity: string, product: number) {
    this.storage.setProductQuantity(product, parseInt(quantity, 10));
  }

  setProductDiscontinued(discontinued: boolean, product: number) {
    this.storage.setProductDiscontinued(product, discontinued);
  }

  addPriceRow(type: number, product: number | null = null) {
    this.storage.addPriceRow(type, product);
  }

  readonly productNameIsUnique = (name: string) => !this.products.getValue().filter(_ => _.type === this.type.id && _.name === name).length;
  readonly quantityIsNatural = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) >= 0 && parseInt(quantity, 10) === parseFloat(quantity);
}
