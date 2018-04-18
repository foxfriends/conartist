/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-user.graphql'
import { parse } from '../model/user'
import type { Response, APIRequest, APIError } from './index'
import type { FullUserQueryVariables, FullUserQuery } from './schema'
import type { User } from '../model/user'

export class UserQuery implements APIRequest<FullUserQueryVariables, User> {
  query: GraphQLQuery<FullUserQueryVariables, FullUserQuery>

  constructor() {
    this.query = new GraphQLQuery(query)
  }

  send(variables: FullUserQueryVariables = { id: null }): Observable<Response<User, APIError>> {
    return this.query.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.user) }
          : response
        )
      )
  }
}
