import { Component, Input, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';
import template from './product-list.component.html';
import styles from './product-list.component.scss';
import { Products, Prices, ProductType } from '../../../../conartist';

@Component({
  selector: 'con-product-list',
  template: template,
  styles: [ styles ],
})
export default class ProductListComponent {
  @Input() type: ProductType;
  @Input() showDiscontinued = false;

  private _products: BehaviorSubject<Products>;
  private _prices: BehaviorSubject<Prices>;

  readonly productNameIsUnique = (name: string) => !this._products.getValue().filter(_ => _.type === this.type.id && _.name === name).length;
  readonly quantityIsNatural = (quantity: string) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) >= 0 && parseInt(quantity, 10) === parseFloat(quantity);

  constructor(@Inject(StorageService) private storage: StorageService) {
    this._products = storage.products;
    this._prices = storage.prices;
  }

  get products() {
    return this._products.getValue().filter(_ => _.type === this.type.id && (this.showDiscontinued || !_.discontinued));
  }

  // TODO: move these modifier methods to the storage service
  setProductName(name: string, product: number) {
    if(this.productNameIsUnique(name)) {
      this.storage.setProductName(product, name);
    }
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
}
