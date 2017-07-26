import { Injectable, Inject } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/distinctUntilChanged';

import { APIService } from '../api/api.service';
import { ErrorService } from '../modals/error.service';
import { BroadcastService } from '../broadcast/broadcast.service';
import { SignInEvent } from '../broadcast/event';
import { Deferred } from '../../util';

type ObservableUserInfo = {
  [K in keyof ca.UserInfo]: BehaviorSubject<ca.UserInfo[K]>;
}

function clean<T extends { dirty?: boolean; }>(obj: T) {
  const dup: T = { ...obj as any }; // typescript why
  delete dup.dirty;
  return dup;
}

@Injectable()
export class StorageService implements ObservableUserInfo {
  private _email: BehaviorSubject<ca.UserInfo['email']>;
  private _keys: BehaviorSubject<ca.UserInfo['keys']>;
  private _products: BehaviorSubject<ca.UserInfo['products']>;
  private _prices: BehaviorSubject<ca.UserInfo['prices']>;
  private _types: BehaviorSubject<ca.UserInfo['types']>;
  private _conventions: BehaviorSubject<ca.UserInfo['conventions']>;

  private __email: ca.UserInfo['email'];
  private __keys: ca.UserInfo['keys'];
  private __products: ca.UserInfo['products'];
  private __prices: ca.UserInfo['prices'];
  private __types: ca.UserInfo['types'];
  private __conventions: ca.UserInfo['conventions'];

  private initialized = new Deferred<void>();

  constructor(
    @Inject(APIService) private api: APIService,
    @Inject(MdSnackBar) private snackbar: MdSnackBar,
    @Inject(ErrorService) private error: ErrorService,
    @Inject(BroadcastService) broadcast: BroadcastService,
  ) {
    this.reset();
    broadcast.filter(_ => _ instanceof SignInEvent).subscribe(() =>
      this.api.getUserInfo().subscribe(_ => {
        this._email.next(this.__email = _.email);
        this._keys.next(this.__keys = _.keys);
        this._products.next(this.__products = _.products);
        this._prices.next(this.__prices = _.prices);
        this._types.next(this.__types = _.types);
        this._conventions.next(this.__conventions = _.conventions);
        this.initialized.resolve();
      })
    );
  }

  get email() { return this._email; }
  get keys() { return this._keys; }
  get products() { return this._products; }
  get prices() { return this._prices; }
  get types() { return this._types; }
  get conventions() { return this._conventions; }

  convention(code: string, fill: boolean = false): Observable<ca.Convention> {
    if(fill) {
      this.fillConvention(code);
    }
    return this._conventions
      .map(_ => _.find(_ => _.code === code))
      .filter((_): _ is ca.Convention => !!_)
      .distinctUntilChanged();
  }

  updateConvention(con: ca.Convention) {
    this._conventions.next(this._conventions.getValue().map(_ => _.code === con.code ? { ...con, dirty: true } : _));
  }

  addConvention(con: ca.MetaConvention | ca.FullConvention) {
    if(this._keys.getValue()) {
      const withoutInvalid = this._conventions.getValue().filter(_ => {
        if(_.code === con.code) {
          if(_.type === 'invalid') {
            return false;
          } else {
            throw new Error(`You are already signed up for ${con.title}`);
          }
        }
        return true;
      });
      this._conventions.next([...withoutInvalid, { ...con, dirty: true }]);
      this._keys.next(this._keys.getValue() - 1);
    } else {
      throw new Error('You don\'t have any more keys');
    }
  }

  removeConvention(code: string) {
    if(this._conventions.getValue().find(_ => _.code === code)) {
      this._conventions.next(
        this._conventions.getValue().map(
          _ => _.code === code ? { type: 'invalid' as 'invalid', code, dirty: true } : _
        )
      );
      this._keys.next(this._keys.getValue() + 1);
    }
  }

  addConventionProduct(con: ca.FullConvention, product: ca.Product) {
    this.updateConvention({
      ...con,
      data: {
        ...con.data,
        products: [...con.data.products.filter(_ => _.id !== product.id), { ...product, discontinued: false, dirty: true }]
      }
    });
  }
  removeConventionProduct(con: ca.FullConvention, product: ca.Product) {
    this.updateConvention({
      ...con,
      data: {
        ...con.data,
        products: con.data.products.map(
          _ => _.id === product.id
          ? { ..._, discontinued: true, dirty: true }
          : _)
      }
    });
  }

  async fillConvention(code: string): Promise<Observable<ca.FullConvention>> {
    await this.initialized;
    const con = this._conventions.getValue().find(_ => _.code === code);
    if(!con) { throw new Error(`ca.Convention ${code} does not exist`); }
    if(con.type === 'full') { return this.convention(code).filter((con): con is ca.FullConvention => con.type === 'full'); }
    const filled = await this.api.loadConvention(con.code).toPromise();
    this._conventions.next(this._conventions.getValue().map(_ => _.code === code ? filled : _));
    return this.convention(code).filter((con): con is ca.FullConvention => con.type === 'full');
  }

  createProduct(type: ca.ProductType): ca.Product {
    // TODO: check that new name is unique
    const index = this._products.getValue().length + 1;
    const product = {
      name: `${type.name} ${index}`,
      quantity: 0,
      type: type.id,
      id: -index,
      discontinued: false
    }
    this._products.next([
      ...this._products.getValue(),
      product
    ]);
    return product;
  }

  setProductName(product: number, name: string) {
    this._products.next(this._products.getValue().map(_ => _.id === product ? { ..._, name, dirty: true } : _));
  }

  setProductQuantity(product: number, quantity: number) {
    this._products.next(this._products.getValue().map(_ => _.id === product ? { ..._, quantity, dirty: true } : _));
  }

  setProductDiscontinued(product: number, discontinued: boolean) {
    const before = this._products.getValue().length;
    let type: number;
    this._products.next(
      this._products.getValue()
        .map(_ => {
          if(_.id === product) {
            type = _.type;
            return { ..._, discontinued, dirty: true };
          }
          return _;
        })
        .filter(_ => _.id >= 0 || !_.discontinued)
    );

    if(before > this._products.getValue().length) {
      this._prices.next(
        this._prices.getValue().filter(
          _ => _.type !== type || _.product !== product
        )
      )
    }
  }

  createType(index: number) {
    this._types.next([
      ...this._types.getValue(),
      {
        name: `Type ${index}`,
        color: 0xFFFFFF,
        id: -index,
        discontinued: false,
        dirty: true,
      }
    ]);
  }

  setTypeName(type: number, name: string) {
    this._types.next(this._types.getValue().map(_ => _.id === type ? { ..._, name, dirty: true } : _));
  }

  setTypeDiscontinued(type: number, discontinued: boolean) {
    this._types.next(this._types.getValue().map(_ => _.id === type ? { ..._, discontinued, dirty: true } : _).filter(_ => _.id > 0 || !_.discontinued));
  }

  setTypeColor(type: number, color: number) {
    this._types.next(this._types.getValue().map(_ => _.id === type ? { ..._, color, dirty: true } : _));
  }

  setPriceList(type: number, product: number | null, prices: ca.PriceList) {
    this._prices.next(
      this._prices
        .getValue()
        .map(
          _ => _.type === type && _.product === product
            ? {
              ..._,
              prices,
              dirty: true,
            } : _
        ));
  }

  setPriceQuantity(type: number, product: number | null, index: number, quantity: number) {
    this._prices.next(
      this._prices
        .getValue()
        .map(
          _ => _.type === type && _.product === product
            ? {
              ..._,
              prices: _.prices.map(([q, p], i) => [index === i ? quantity : q, p]),
              dirty: true,
            } : _
        ));
  }

  setPricePrice(type: number, product: number | null, index: number, price: number) {
    this._prices.next(
      this._prices
        .getValue()
        .map(
          _ => _.type === type && _.product === product
            ? {
              ..._,
              prices: _.prices.map(([q, p], i) => [q, index === i ? Math.round(100 * price) / 100 : p]),
              dirty: true,
            } : _
        ));
  }

  addPriceRow(type: number, product: number | null = null) {
    const prices = this._prices.getValue();
    const existing = prices.find(_ => _.type === type && _.product === product);
    if(existing) {
      const extended = existing.prices.sort((a, b) => a[0] - b[0]);
      extended.push([ (extended[extended.length - 1] || [0])[0] + 1, 0 ]);
      this._prices.next(prices.map(_ => _ === existing ? { ...existing, prices: extended, dirty: true } : _))
    } else {
      this._prices.next([
        ...prices,
        { type, product, prices: [ [1, 0] ], dirty: true },
      ]);
    }
  }

  removePriceRow(type: number, product: number | null, index: number) {
    this._prices.next(
      this._prices.getValue()
        .map(_ => _.type === type && _.product === product ? { ..._, prices: _.prices.filter((_, i) => i !== index), dirty: true } : _)
        .filter(_ => ((_.product === null || _.product >= 0) && _.type >= 0) || _.prices.length > 0)
    );
  }

  async commit(rollback: boolean = false) {
    enum Stage { Types, Products, Prices, Conventions, Complete };
    let stage: Stage = Stage.Types;
    try {
      const oldTypes = this._types.getValue();
      let oldProducts = this._products.getValue();
      let oldPrices = this._prices.getValue();

      const newTypes = await this.api.saveTypes(oldTypes).toPromise();
      const nextTypes = oldTypes
        .map(type => {
          if(type.id >= 0) { return { ...type, dirty: false }; };
          const next = newTypes.find(_ => _.name === type.name);
          if(!next) { throw new Error('New product does not exist'); }
          oldProducts = oldProducts.map(_ => _.type === type.id ? { ..._, type: next.id } : _);
          oldPrices = oldPrices.map(_ => _.type === type.id ? { ..._, type: next.id } : _);
          return next;
        })
        .map(clean);
      this.__types = nextTypes;

      stage =  Stage.Products;
      const newProducts = await this.api.saveProducts(oldProducts).toPromise();
      const nextProducts = oldProducts
        .map(product => {
          if(product.id >= 0) { return { ...product, dirty: false }; }
          const next = newProducts.find(_ => _.type === product.type && _.name === product.name);
          if(!next) { throw new Error('New product does not exist'); }
          oldPrices = oldPrices.map(_ => _.product === product.id ? { ..._, product: next.id } : _);
          return next;
        })
        .map(clean);
      this.__products = nextProducts;

      stage = Stage.Prices;
      await this.api.savePrices(oldPrices).toPromise();
      const nextPrices = oldPrices.map(clean);
      this.__prices = nextPrices;

      stage = Stage.Conventions;
      const oldConventions = this._conventions.getValue();
      await this.api.saveConventions(oldConventions).toPromise();
      const nextConventions = oldConventions
        .map(clean)
        .map(_ => _.type === 'full' ? {
            ..._,
            data: {
              ..._.data,
              products: _.data.products.filter(_ => !_.discontinued).map(clean),
              prices: _.data.prices.filter(_ => _.prices.length).map(clean),
            }
          } : _);
      this.__conventions = nextConventions;

      stage = Stage.Complete;
      this._types.next(nextTypes);
      this._products.next(nextProducts);
      this._prices.next(nextPrices);
      this._conventions.next(nextConventions);

      this.snackbar.open('Saved', 'Dismiss', { duration: 3000 });
    } catch(error) {
      console.error(error);
      this.error.open(error);

      if(rollback) {
        this._types.next(this.__types);
        this._products.next(this.__products);
        this._prices.next(this.__prices);
        this._conventions.next(this.__conventions);
      } else {
        switch(stage as Stage) { // typescript why
          case Stage.Conventions:
            this._conventions.next(this.__conventions);
            // falls through
          case Stage.Prices:
            this._prices.next(this.__prices);
            // falls through
          case Stage.Products:
            this._products.next(this.__products);
            // falls through
          case Stage.Types:
            this._types.next(this.__types);
        }
      }
    }
  }

  discard() {
    this._email.next(this.__email);
    this._keys.next(this.__keys);
    this._types.next(this.__types);
    this._products.next(this.__products);
    this._prices.next(this.__prices);
    this._conventions.next(this.__conventions);
  }

  reset() {
    this._email = new BehaviorSubject('');
    this.__email = '';
    this._keys = new BehaviorSubject(0);
    this.__keys = 0;
    this._products = new BehaviorSubject([]);
    this.__products = [];
    this._prices = new BehaviorSubject([]);
    this.__prices = [];
    this._types = new BehaviorSubject([]);
    this.__types = [];
    this._conventions = new BehaviorSubject([]);
    this.__conventions = [];
    this.initialized = new Deferred();
  }
}
