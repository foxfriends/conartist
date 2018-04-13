/* @flow */
import { GetRequest, GraphQLQuery } from './index'
import { Observable } from 'rxjs/Observable'
import type { Response } from './index'
import { Storage } from '../storage'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import Query from './graphql/queries.graphql'

export class ReauthorizeRequest extends GetRequest<'', string> {
  constructor() {
    super('/api/auth')
  }

  send(params: '' = ''): Observable<Response<string>> {
    return super.send('')
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
