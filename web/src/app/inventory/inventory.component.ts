import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/toPromise';

import { StorageService } from '../data/storage.service';
import template from './inventory.component.html';
import styles from './inventory.component.scss';

@Component({
  selector: 'con-inventory',
  template: template,
  styles: [ styles ],
})
export class InventoryComponent {
  private _products: BehaviorSubject<ca.Products>
  private _types: BehaviorSubject<ca.ProductTypes>

  tabIndex = 0;

  showDiscontinuedProducts = false;
  private _showDiscontinuedTypes = false;

  constructor(
    @Inject(StorageService) private storage: StorageService,
  ) {
    this._products = storage.products;
    this._types = storage.types;
    this._types.subscribe(() => this.restrictTabIndex());
  }

  get showDiscontinuedTypes() { return this._showDiscontinuedTypes; }
  set showDiscontinuedTypes(show: boolean) {
    const tab = this.__types.length ? this.__types[this.tabIndex].name : null;
    this._showDiscontinuedTypes = show;
    if(tab) {
      const found = this.__types.findIndex(_ => _.name === tab);
      if(found !== -1) {
        this.tabIndex = found;
        return;
      }
    }
    this.restrictTabIndex();
  }

  private restrictTabIndex() {
    if(this.tabIndex === this.__types.length && this.tabIndex !== 0) {
      --this.tabIndex;
    }
  }

  get types() {
    // TODO: what order should types come in? save an order in the database?
    return this._types.map(_ => _.filter(_ => this.showDiscontinuedTypes || !_.discontinued));
  }

  private get __types() {
    // TODO: what order should types come in? save an order in the database?
    return this._types.getValue().filter(_ => this.showDiscontinuedTypes || !_.discontinued);
  }

  trackID(type: ca.ProductType) {
    return type.id;
  }

  products(type: number) {
    return this._products.getValue().filter(_ => _.type === type);
  }

  tabChange(index: number) {
    const max = this.__types.length;
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

  setTypeColor(type: number, color: ca.Color) {
    this.storage.setTypeColor(type, color);
  }

  createProduct(type: ca.ProductType) {
    this.storage.createProduct(type);
  }

  readonly typeNameIsUnique = (name: string) => !this._types.getValue().filter(_ => _.name === name).length;

  async exportInventoryData(type: ca.ProductType) {
    // TODO: allow for customizing the format of generated files
    const header = 'ID,Name,Quantity,Discontinued\n';
    const data = this.products(type.id).map(_ => `${_.id},${_.name},${_.quantity},${_.discontinued}\n`);
    saveAs(
      new Blob([header, ...data], { type: 'text/csv;charset=utf-8' }),
      `conartist-inventory-${type.name}.csv`,
      true
    );
  }

  async importInventoryData(type: ca.ProductType) {
    const input: HTMLInputElement = document.createElement('INPUT') as HTMLInputElement;
    input.setAttribute('type', 'file');
    input.click();
    await Observable.fromEvent(input, 'change').take(1).toPromise();
    if(input.files && input.files[0]) {
      const file = input.files[0];
      const fr = new FileReader();
      fr.readAsText(file);
      await Observable.fromEvent(fr, 'loadend').take(1).toPromise();
      const products = this.products(type.id);
      const values = (fr.result as string)
        .split('\n')
        .filter(_ => !!_)
        .map(_ => _.split(',') .map(_ => _.trim())) as [string, string, string, string][];
      // TODO: handle different row configurations
      values.forEach(row => {
        if(row.length < 4) {
          row.unshift('New');
        }
        if(row.length < 4) {
          row[3] = 'false';
        }
        const [ id, name, quantity, discontinued ] = row;
        if(isNaN(parseInt(quantity, 10))) { return; }
        const dc = ['y', 'true', 't'].includes(discontinued.toLowerCase());
        const qty = parseInt(quantity, 10);
        const product =
          (!isNaN(+id)
            ? products.find(_ => _.id === +id)
            : products.find(_ => _.name === name))
            || this.storage.createProduct(type);
        this.storage.setProductName(product.id, name);
        this.storage.setProductQuantity(product.id, qty);
        this.storage.setProductDiscontinued(product.id, dc);
      });
    }
  }
}
