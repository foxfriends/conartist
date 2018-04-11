/* @flow */
import { PostRequest } from './index'
import type { Observable } from 'rxjs/Observable'
import type { Response } from './index'
import { Storage } from '../storage'
import 'rxjs/add/operator/do'

type Params = {|
  usr: string,
  psw: string,
|}

export class SignInRequest extends PostRequest<Params, string> {
  constructor() {
    super('/api/auth')
  }

  send(params: Params): Observable<Response<string>> {
    return super.send(params)
      .do(response => {
        if (response.state === 'retrieved') {
          Storage.store(Storage.Auth, response.value)
        } else if (response.state === 'failed') {
          Storage.remove(Storage.Auth)
        }
      })
  }
}
