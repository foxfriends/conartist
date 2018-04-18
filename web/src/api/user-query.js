/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-user.graphql'
import { parse } from '../model/user'
import type { Response } from './index'
import type { FullUserQueryVariables as Variables, FullUserQuery as Value } from './schema'
import type { User } from '../model/user'

export class UserQuery extends GraphQLQuery<Variables, Value, Variables, User> {
  constructor() {
    super(query)
  }

  send(variables: Variables = { id: null }): Observable<Response<User, string>> {
    return this._send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.user) }
          : response
        )
      )
  }
}
