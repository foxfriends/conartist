/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-convention.graphql'
import { parse } from '../model/full-convention'
import type { Response, APIRequest, APIError } from './index'
import type { FullConventionQueryVariables, FullConventionQuery } from './schema'
import type { FullConvention } from '../model/full-convention'

export class LoadConvention implements APIRequest<FullConventionQueryVariables, FullConvention> {
  query: GraphQLQuery<FullConventionQueryVariables, FullConventionQuery>

  constructor() {
    this.query = new GraphQLQuery(query)
  }

  send(variables: FullConventionQueryVariables): Observable<Response<FullConvention, APIError>> {
    return this.query.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.convention) }
          : response
        )
      )
  }
}
