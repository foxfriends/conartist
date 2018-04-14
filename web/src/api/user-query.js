/* @flow */
import type { Observable } from 'rxjs/Observable'
import type { Response } from './index'
import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-user.graphql'
import type { User } from '../model/user'

export type Params = { id?: number }
export class UserQuery extends GraphQLQuery<Params, { user: User }, 'user'> {
  constructor() {
    super(query, 'user')
  }

  send(params: Params = {}): Observable<Response<User>> {
    return super.send(params)
  }
}
