/* @flow */
import type { Observable } from 'rxjs/Observable'
import type { Response } from './index'
import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-user.graphql'
import type { FullUserQueryVariables as Params, FullUserQuery as T } from './schema'

export class UserQuery extends GraphQLQuery<Params, T, 'user'> {
  constructor() {
    super(query, 'user')
  }

  send(params: Params = { id: null }): Observable<Response<$ElementType<T, 'user'>>> {
    return super.send(params)
  }
}
