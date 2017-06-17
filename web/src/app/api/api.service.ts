import { Injectable } from '@angular/core';
import ca from '../../../../conartist';

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

async function get<T>(url: string): Promise<ca.APIResult<T>> {
  const result = await fetch(url);
  return result.json();
}

async function post<T>(url: string, body: object): Promise<ca.APIResult<T>> {
  const result = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
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
}
