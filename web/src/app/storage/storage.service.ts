import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import APIService from '../api/api.service';
import { UserInfo } from '../../../../conartist';
import { userInfo } from '../api/api.service.mock';

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
    this._products = new BehaviorSubject({});
    this._prices = new BehaviorSubject({});
    this._types = new BehaviorSubject({});
    this._conventions = new BehaviorSubject([]);
    this.api.getUserInfo().subscribe(_ => {
      {
        const _ = userInfo;
        this._email.next(_.email);
        this._keys.next(_.keys);
        this._products.next(_.products);
        this._prices.next(_.prices);
        this._types.next(_.types);
        this._conventions.next(_.conventions);
      }
    });
  }

  get email() { return this._email; }
  get keys() { return this._keys; }
  get products() { return this._products; }
  get prices() { return this._prices; }
  get types() { return this._types; }
  get conventions() { return this._conventions; }
}
