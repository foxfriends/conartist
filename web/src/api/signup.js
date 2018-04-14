/* @flow */
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import { PostRequest } from './index'
import { Storage } from '../storage' 
import type { Response } from './index'
import type { User } from '../model/user'
import { UserQuery } from './user-query'

type Params = {|
  name: string,
  email: string,
  password: string,
|}

export class SignUpRequest extends PostRequest<Params, User> {
  constructor() {
    super('/api/account/new')
  }

  send(params: Params): Observable<Response<User>> {
    return super.send(params)
      .do(response => {
        if (response.state === 'retrieved') {
          Storage.store(Storage.Auth, response.value)
        } else if (response.state === 'failed') {
          Storage.remove(Storage.Auth)
          throw response
        }
      })
      .filter(({ state }) => state === 'retrieved')
      .switchMap(() => new UserQuery().send())
      .catch(error => Observable.of(error))
  }
}
