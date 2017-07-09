import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import StorageService from '../data/storage.service';
import template from './inventory.component.html';
import styles from './inventory.component.scss';
import { Products, ProductType, ProductTypes, Prices, Color } from '../../../../conartist';

@Component({
  selector: 'con-inventory',
  template: template,
  styles: [ styles ],
})
export default class InventoryComponent {
  private _products: BehaviorSubject<Products>
  private _types: BehaviorSubject<ProductTypes>
  private _prices: BehaviorSubject<Prices>;

  readonly typeNameIsUnique = (name: string) => !this._types.getValue().filter(_ => _.name === name).length;

  tabIndex = 0;

  showDiscontinuedProducts = false;
  private _showDiscontinuedTypes = false;

  constructor(
    @Inject(StorageService) private storage: StorageService,
  ) {
    this._products = storage.products;
    this._types = storage.types;
    this._prices = storage.prices;
    this._types.subscribe(() => this.restrictTabIndex());
  }

  get showDiscontinuedTypes() { return this._showDiscontinuedTypes; }
  set showDiscontinuedTypes(show: boolean) {
    const tab = this.types.length ? this.types[this.tabIndex].name : null;
    this._showDiscontinuedTypes = show;
    if(tab) {
      const found = this.types.findIndex(_ => _.name === tab);
      if(found !== -1) {
        this.tabIndex = found;
        return;
      }
    }
    this.restrictTabIndex();
  }

  private restrictTabIndex() {
    if(this.tabIndex === this.types.length && this.tabIndex !== 0) {
      --this.tabIndex;
    }
  }

  get types() {
    // TODO: what order should types come in? save an order in the database?
    return this._types.getValue().filter(_ => this.showDiscontinuedTypes || !_.discontinued);
  }

  trackID(type: ProductType) {
    return type.id;
  }

  products(type: number) {
    return this._products.getValue().filter(_ => _.type === type);
  }

  tabChange(index: number) {
    const max = this.types.length;
    if(index === max) {
      this.createType(index + 1);
    }
    this.tabIndex = index;
  }

  createType(index: number) {
    this.storage.createType(index);
  }

  addPriceRow(type: number, product: number | null = null) {
    this.storage.addPriceRow(type, product);
  }

  setTypeName(name: string, type: number) {
    this.storage.setTypeName(type, name);
  }

  setTypeDiscontinued(discontinued: boolean, type: number) {
    this.storage.setTypeDiscontinued(type, discontinued);
  }

  setTypeColor(type: number, color: Color) {
    this.storage.setTypeColor(type, color);
  }

  createProduct(type: ProductType, index: number) {
    this.storage.createProduct(type, index);
  }
}
