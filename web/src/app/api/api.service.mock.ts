import { Injectable } from '@angular/core';
import APIService from './api.service';
import { UserInfo } from '../../../../conartist';

import { Observable } from 'rxjs/Observable';

export const existingUser = {
  email: 'test@conartist.com',
  password: 'test-password',
};

export const newUser = {
  email: 'new@conartist.com',
  password: 'new-password',
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
    return Observable.of({
      keys: 3,
      email: existingUser.email,
      products: {},
      prices: {},
      types: {},
      conventions: [],
    });
  }
}

export default new APIServiceMock();

export { default as APIService } from './api.service';
