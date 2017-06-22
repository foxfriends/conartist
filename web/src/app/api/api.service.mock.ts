import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import APIService from './api.service';
import { UserInfo, Records, FullConvention } from '../../../../conartist';

export const existingUser = {
  email: 'test@conartist.com',
  password: 'test-password',
};

export const newUser = {
  email: 'new@conartist.com',
  password: 'new-password',
};

export const userInfo: UserInfo = {
  email: existingUser.email,
  keys: 3,
  products: {
    type: [ { name: 'product-name', quantity: 15, id: 0, type: 'type' } ],
    type2: [ { name: 'product-name2', quantity: 4, id: 1, type: 'type2' } ],
  },
  prices: {
    type: [ [ 3, 10 ], [1, 5] ],
    type2: [ [ 1, 2] ],
  },
  types: {
    type: { name: 'type', color: [255, 0, 0], id: 0 },
    type2: { name: 'type2', color: [0, 255, 0], id: 1 },
  },
  conventions: [
    { title: 'con-name0', code: 'xyzab', start: new Date(1407920489636), end: new Date(1408179726301) },
    { title: 'con-name1', code: 'abcde', start: new Date(1497920489636), end: new Date(1498179726301) },
    { title: 'con-name2', code: 'fghij', start: new Date(1527920489636), end: new Date(1528179726301) },
  ],
};

export const records: Records = [
  { type: 'type', products: [ 'product-name' ], price: 5, time: 1497952889636 },
  { type: 'type', products: [ 'product-name', 'product-name' ], price: 10, time: 1497972889636 },
  { type: 'type2', products: [ 'product-name2', 'product-name2' ], price: 4, time: 1497992889636 },
];

export const fullConventions: FullConvention[] = userInfo.conventions.map(_ => ({
    ..._,
    data: {
      products: userInfo.products,
      prices: userInfo.prices,
      types: userInfo.types,
      records
    }
  }));

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
    return Observable.of(fullConventions.find(_ => _.code === code));
  }
}

export default new APIServiceMock;

export { default as APIService } from './api.service';
