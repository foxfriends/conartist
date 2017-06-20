import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { APIResult, UserInfo } from '../../../../conartist';

function host([...strings]: TemplateStringsArray, ...params: any[]): string {
  function zip(a: string[], b: string[]) {
    a = [...a];
    for(let i = b.length - 1; i >= 0; --i) {
      a.splice(2 * i - 1, 0, b[i]);
    }
    return a;
  }
  return 'http://localhost:8080' + zip(strings, params.map(_ => `${_}`)).join('');
}

function handle<T>(response: Response): T {
  const result = response.json() as APIResult<T>;
  if(result.status === 'Success') {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}

@Injectable()
export default class APIService {
  constructor(@Inject(Http) private http: Http) {}

  private get options(): RequestOptionsArgs {
    const headers = new Headers();
    const token = localStorage.getItem('authtoken');
    if(token) {
      headers.append('Authorization', `Bearer ${token}`)
    }
    return { headers };
  }

  isUniqueEmail(email: string): Observable<boolean> {
    return this.http
      .get(host`/api/account/exists/${email}`, this.options)
      .map(_ => handle<boolean>(_))
      .map(_ => !_);
  }

  signIn(usr: string, psw: string): Observable<string> {
    return this.http
      .post(host`/api/auth/`, { usr, psw }, this.options)
      .map(_ => handle<string>(_))
      .catch(_ => Observable.throw(new Error('Incorrect username or password')));
  }

  signUp(usr: string, psw: string): Observable<void> {
    return this.http
      .post(host`/api/account/new/`, { usr, psw }, this.options)
      .map(_ => { handle<void>(_); })
      .catch(_ => Observable.throw(new Error('Could not create your account')));
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http
      .get(host`/api/user/`, this.options)
      .map(_ => handle<UserInfo>(_));
  }
}
