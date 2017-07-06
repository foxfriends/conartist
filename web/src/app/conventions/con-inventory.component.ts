import { Component, Input, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';

import template from './con-inventory.component.html';
import styles from './con-inventory.component.scss';
import { FullConvention, Product, Products } from '../../../../conartist';

@Component({
  selector: 'con-con-inventory',
  template: template,
  styles: [ styles ],
})
export default class ConInventoryComponent {
  @Input() con: FullConvention;
  private _products: BehaviorSubject<Products>;
  constructor(@Inject(StorageService) private storage: StorageService) {
    this._products = storage.products;
  }

  get products(): Products {
    return this._products.getValue().sort((a, b) => a.type - b.type);
  }

  included({ id }: Product): boolean {
    return !!this.con.data.products.find(_ => _.id === id);
  }

  toggleIncluded(product: Product) {
    if(this.included(product)) {
      this.storage.updateConvention({ ...this.con, data: { ...this.con.data, products: this.con.data.products.filter(_ => _.id !== product.id) }});
    } else {
      this.storage.updateConvention({ ...this.con, data: { ...this.con.data, products: [...this.con.data.products, product] }});
    }
  }
}
