import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import APIService from './api.service';
import { Products, Prices, ProductTypes, UserInfo, Records, MetaConvention, FullConvention } from '../../../../conartist';

export const existingUser = {
  email: 'test@conartist.com',
  password: 'test-password',
};

export const newUser = {
  email: 'new@conartist.com',
  password: 'new-password',
};

export const products: Products = [
  { name: 'product-name1', quantity: 15, id: 0, type: 0, discontinued: false },
  { name: 'product-name2', quantity: 8, id: 1, type: 0, discontinued: false },
  { name: 'product-name3', quantity: 4, id: 2, type: 1, discontinued: false },
];

export const prices: Prices = [
  { type: 0, product: null, prices: [[ 3, 10 ], [1, 5]] },
  { type: 0, product: 1, prices: [[ 1, 7 ]] },
  { type: 1, product: null, prices: [[ 1, 2]] },
];

export const types: ProductTypes = [
  { name: 'type', color: [255, 0, 0], id: 0, discontinued: false },
  { name: 'type2', color: [0, 255, 0], id: 1, discontinued: false },
];

export const records: Records = [
  { products: [ 0 ], price: 5, time: 1497952889636 },
  { products: [ 0, 1 ], price: 12, time: 1497972889636 },
  { products: [ 2, 2 ], price: 4, time: 1497992889636 },
];

export const conventions: MetaConvention[] = [
  { type: 'meta', title: 'con-name0', code: 'xyzab', start: new Date(1407920489636), end: new Date(1408179726301) },
  { type: 'meta', title: 'con-name1', code: 'abcde', start: new Date(1497920489636), end: new Date(1498179726301) },
  { type: 'meta', title: 'con-name2', code: 'fghij', start: new Date(1527920489636), end: new Date(1528179726301) },
];

export const fullConventions: FullConvention[] = conventions.map(_ => ({
    ..._,
    type: 'full' as 'full', // typescript why
    data: {
      products,
      prices,
      types,
      records
    }
  }));

export const userInfo: UserInfo = {
  email: existingUser.email,
  keys: 3,
  products,
  prices,
  types,
  conventions,
};

export const invalidConCode = 'xxxxx';
export const validConCode = 'abcde';

@Injectable()
class APIServiceMock extends APIService {
  constructor() {
    super({} as any);
  }

  isUniqueEmail(email: string): Observable<boolean> {
    return Observable.of(email === existingUser.email ? false : true);
  }

  signIn(usr: string, psw: string): Observable<string> {
    if(usr === existingUser.email && psw === existingUser.password) {
      return Observable.of('FakeJWT');
    } else {
      return Observable.throw(new Error('Incorrect username or password'));
    }
  }

  reauthorize(): Observable<string> {
    return Observable.of('FakeJWT');
  }

  signUp(usr: string, _psw: string): Observable<undefined> {
    if(usr === existingUser.email) {
      return Observable.throw(new Error('Could not create your account'));
    } else {
      return Observable.of(undefined);
    }
  }

  getUserInfo(): Observable<UserInfo> {
    return Observable.of(userInfo);
  }

  loadConvention(code: string): Observable<FullConvention> {
    const con = fullConventions.find(_ => _.code === code);
    if(con) {
      return Observable.of(con);
    } else {
      return Observable.throw('Con could not be loaded');
    }
  }
}

export default new APIServiceMock;

export { default as APIService } from './api.service';
