import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/distinctUntilChanged';

import APIService from '../api/api.service';
import { UserInfo, Convention } from '../../../../conartist';

type ObservableUserInfo = {
  [K in keyof UserInfo]: BehaviorSubject<UserInfo[K]>;
}

@Injectable()
export default class StorageService implements ObservableUserInfo {
  private _email: BehaviorSubject<UserInfo['email']>;
  private _keys: BehaviorSubject<UserInfo['keys']>;
  private _products: BehaviorSubject<UserInfo['products']>;
  private _prices: BehaviorSubject<UserInfo['prices']>;
  private _types: BehaviorSubject<UserInfo['types']>;
  private _conventions: BehaviorSubject<UserInfo['conventions']>;

  constructor(@Inject(APIService) private api: APIService) {
    this._email = new BehaviorSubject('');
    this._keys = new BehaviorSubject(0);
    this._products = new BehaviorSubject([]);
    this._prices = new BehaviorSubject([]);
    this._types = new BehaviorSubject([]);
    this._conventions = new BehaviorSubject([]);
    this.api.getUserInfo().subscribe(_ => {
      this._email.next(_.email);
      this._keys.next(_.keys);
      this._products.next(_.products);
      this._prices.next(_.prices);
      this._types.next(_.types);
      this._conventions.next(_.conventions);
    });
  }

  get email() { return this._email; }
  get keys() { return this._keys; }
  get products() { return this._products; }
  get prices() { return this._prices; }
  get types() { return this._types; }
  get conventions() { return this._conventions; }

  fillConvention(code: string) {
    this._conventions
      // flatMap doing what I want would be nice... but I guess typescript is too weak for rxjs
      .take(1)
      .map(_ => _.find(_ => _.code === code)!).filter(_ => !!_)
      .flatMap(_ => _.type === 'full' ? Observable.of(_) : this.api.loadConvention(_.code))
      .subscribe(full => this._conventions.next(this._conventions.getValue().map(_ => _.code === code ? full : _)));
  }

  convention(code: string) {
    return this._conventions
      .map(_ => _.find(_ => _.code === code)!).filter(_ => !!_)
      .distinctUntilChanged();
  }

  updateConvention(con: Convention) {
    this._conventions.next(this._conventions.getValue().map(_ => _.code === con.code ? con : _));
  }

  async commit() {
    const oldTypes = this._types.getValue();
    let oldProducts = this._products.getValue();
    let oldPrices = this._prices.getValue();
    const newTypes = await this.api.saveTypes(oldTypes).toPromise();;
    const nextTypes = oldTypes.map(type => {
      if(type.id >= 0) { return { ...type, dirty: false }; };
      const next = newTypes.find(_ => _.name === type.name)!;
      oldProducts = oldProducts.map(_ => _.type === type.id ? { ..._, type: next.id } : _);
      oldPrices = oldPrices.map(_ => _.type === type.id ? { ..._, type: type.id } : _);
      return next;
    });

    const newProducts = await this.api.saveProducts(oldProducts).toPromise();
    const nextProducts = oldProducts.map(product => {
      if(product.id >= 0) { return { ...product, dirty: false }; }
      oldPrices = oldPrices.map(_ => _.product === product.id ? { ..._, product: product.id } : _);
      return newProducts.find(_ => (_.name === product.name && _.type === product.type) || _.id === product.id)!;
    });

    this._types.next(nextTypes);
    this._products.next(nextProducts);
  }
}
