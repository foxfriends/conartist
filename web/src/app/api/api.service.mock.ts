import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { APIService } from './api.service';

export const existingUser = {
  email: 'test@conartist.com',
  password: 'test-password',
};

export const newUser = {
  email: 'new@conartist.com',
  password: 'new-password',
};

export const products: ca.Products = [
  { name: 'product-name1', quantity: 15, id: 1, type: 1, discontinued: false },
  { name: 'product-name2', quantity: 8, id: 2, type: 1, discontinued: false },
  { name: 'product-name3', quantity: 4, id: 3, type: 2, discontinued: false },
];

export const prices: ca.Prices = [
  { type: 1, product: null, prices: [[3, 10], [1, 5]] },
  { type: 1, product: 2, prices: [[1, 7], [2, 8]] },
  { type: 2, product: null, prices: [[1, 2]] },
];

export const types: ca.ProductTypes = [
  { name: 'type', color: 0xFF0000, id: 1, discontinued: false },
  { name: 'type2', color: 0x00FF00, id: 2, discontinued: false },
];

export const records: ca.Records = [
  { products: [ 1 ], price: 5, time: 1497952889636 },
  { products: [ 1, 2 ], price: 12, time: 1497972889636 },
  { products: [ 3, 3 ], price: 4, time: 1497992889636 },
];

export const conventions: ca.MetaConvention[] = [
  { type: 'meta', title: 'con-name0', code: 'xyzab', start: new Date(1407920489636), end: new Date(1408179726301) },
  { type: 'meta', title: 'con-name1', code: 'abcde', start: new Date(1497920489636), end: new Date(1498179726301) },
  { type: 'meta', title: 'con-name2', code: 'fghij', start: new Date(1527920489636), end: new Date(1528179726301) },
];

export const fullConventions: ca.FullConvention[] = conventions.map((_): ca.FullConvention => ({
    ..._,
    type: 'full',
    data: {
      products,
      prices,
      types,
      records
    }
  }));

export const userInfo: ca.UserInfo = {
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

  getUserInfo(): Observable<ca.UserInfo> {
    return Observable.of(userInfo);
  }

  loadConvention(code: string): Observable<ca.FullConvention> {
    const con = fullConventions.find(_ => _.code === code);
    if(con) {
      return Observable.of(con);
    } else {
      return Observable.throw('Con could not be loaded');
    }
  }
}

const mock = new APIServiceMock;
export { mock as APIServiceMock };

export { APIService } from './api.service';
