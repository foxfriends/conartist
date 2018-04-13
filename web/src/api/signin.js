/* @flow */
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import { PostRequest, GraphQLQuery } from './index'
import { Storage } from '../storage'
import type { Response } from './index'
import type { User } from '../model/user'
import Query from './graphql/queries.graphql'

console.log(Query)

type Params = {|
  usr: string,
  psw: string,
|}

export class SignInRequest extends PostRequest<Params, User> {
  constructor() {
    super('/api/auth')
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
      .switchMap(() => new GraphQLQuery(Query.User).send())
      .catch(error => Observable.of(error))
  }
}
