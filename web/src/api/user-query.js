/* @flow */
import type { Observable } from 'rxjs/Observable'
import type { Response } from './index'

import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-user.graphql'
import { parse } from '../model/user'
import type { FullUserQueryVariables as Params, FullUserQuery as T } from './schema'
import type { User } from '../model/user'

export class UserQuery extends GraphQLQuery<Params, T, 'user', User> {
  constructor() {
    super(query, 'user', parse)
  }

  send(params: Params = { id: null }): Observable<Response<User>> {
    return super.send(params)
  }
}
