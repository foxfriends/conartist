import { Injectable } from '@angular/core';
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

async function get<T>(url: string): Promise<APIResult<T>> {
  const headers = new Headers();
  if(localStorage.getItem('authtoken')) {
    headers.append('Authorization', `Bearer ${localStorage.getItem('authtoken')}`);
  }
  const result = await fetch(url, { headers });
  return result.json();
}

async function post<T>(url: string, body: object): Promise<APIResult<T>> {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if(localStorage.getItem('authtoken')) {
    headers.append('Authorization', `Bearer ${localStorage.getItem('authtoken')}`);
  }
  const result = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
  return result.json();
}

@Injectable()
export default class APIService {
  async isUniqueEmail(email: string): Promise<boolean> {
    const result = await get<boolean>(host`/api/account/exists/${email}`);
    if(result.status === 'Success') {
      return !result.data;
    } else {
      return false;
    }
  }

  async signIn(usr: string, psw: string): Promise<string> {
    const result = await post<string>(host`/api/auth/`, { usr, psw });
    if(result.status === 'Success') {
      return result.data;
    } else {
      throw new Error('Incorrect email or password');
    }
  }

  async signUp(usr: string, psw: string): Promise<void> {
    const result = await post<string>(host`/api/account/new/`, { usr, psw });
    if(result.status === 'Error') {
      throw new Error('Could not create your account');
    }
  }

  async getUserInfo(): Promise<UserInfo> {
    const result = await get<UserInfo>(host`/api/user/`);
    if(result.status === 'Success') {
      return result.data;
    } else {
      throw new Error('Could not retrieve user info');
    }
  }
}
