import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import APIService from './api.service';
import { UserInfo } from '../../../../conartist';

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
  },
  prices: {
    type: [ [ 3, 10 ], [1, 5] ],
  },
  types: {
    type: { name: 'type', color: [255, 0, 0], id: 0 },
  },
  conventions: [
    { title: 'con-name', code: 'abcde', start: new Date(1497920489636), end: new Date(1498179726301) },
  ],
};

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
}

export default new APIServiceMock;

export { default as APIService } from './api.service';
