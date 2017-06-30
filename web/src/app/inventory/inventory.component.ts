import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MdSnackBar } from '@angular/material';

import StorageService from '../data/storage.service';
import template from './inventory.component.html';
import styles from './inventory.component.scss';
import { Products, ProductType, ProductTypes, ID, Prices } from '../../../../conartist';

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

  saving = false;
  showDiscontinuedProducts = false;
  showDiscontinuedTypes = false;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(MdSnackBar) private snackbar: MdSnackBar,
  ) {
    this._products = storage.products;
    this._types = storage.types;
    this._prices = storage.prices;
  }

  get types() {
    // TODO: what order should types come in? save an order in the database?
    return this._types.getValue().filter(_ => this.showDiscontinuedTypes || !_.discontinued);
  }

  trackID(type: ProductType) {
    return type.id;
  }

  products(type: ID) {
    return this._products.getValue().filter(_ => _.type === type);
  }

  tabChange(index: number) {
    const max = Object.keys(this._types.getValue()).length;
    if(index === max) {
      this.createType(index + 1);
    }
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

  setTypeColor(type: number) {
    let color = Math.ceil(Math.random() * 0xFFFFFF);
    this.storage.setTypeColor(type, color);
  }

  createProduct(type: ProductType, index: number) {
    this.storage.createProduct(type, index);
  }

  async saveInventory() {
    this.saving = true;
    try {
      await this.storage.commit();
      this.snackbar.open("Saved", "Dismiss", { duration: 3000 });
    } catch(error) {
      console.error(error);
      this.snackbar.open("Failed to save", "Dismiss");
    } finally {
      this.saving = false;
    }
  }
}
