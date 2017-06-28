import { Component, Input, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';
import template from './product-list.component.html';
import styles from './product-list.component.scss';
import { Products, ProductType } from '../../../../conartist';

@Component({
  selector: 'con-product-list',
  template: template,
  styles: [ styles ],
})
export default class ProductListComponent {
  @Input() type: ProductType;

  private _products: BehaviorSubject<Products>;

  constructor(@Inject(StorageService) storage: StorageService) {
    this._products = storage.products;
  }

  get products() {
    return this._products.getValue().filter(_ => _.type === this.type.id);
  }

  setProductName(name: string, product: number) {
    this._products.next(this._products.getValue().map(_ => _.id === product ? { ..._, name, dirty: true } : _));
  }

  setProductQuantity(quantity: string, product: number) {
    this._products.next(this._products.getValue().map(_ => _.id === product ? { ..._, quantity: +quantity, dirty: true } : _));
  }
}
