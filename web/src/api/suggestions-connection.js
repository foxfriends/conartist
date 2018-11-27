/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  SuggestionsConnection as SuggestionsConnectionQuery,
  SuggestionsConnectionVariables,
} from './schema'
import type { Connection } from '../model/connection'

import { parse } from '../model/suggestion'
import type { Suggestion } from '../model/suggestion'

// $FlowIgnore: trouble importing graphql files
import suggestionsConnection from './graphql/query/suggestions-connection.graphql'

export type Params = {
  after?: string,
}

export class SuggestionsConnection implements APIRequest<Params, Connection<Suggestion>> {
  suggestionsConnection: GraphQLQuery<SuggestionsConnectionVariables, SuggestionsConnectionQuery>

  constructor() {
    this.suggestionsConnection = new GraphQLQuery(suggestionsConnection)
  }

  send({ after }: Params = {}): Observable<Response<Connection<Suggestion>, APIError>> {
    return this.suggestionsConnection.send({ after: after || null })
      .pipe(
        map(
          response => response.state === 'retrieved'
            ? {
                state: 'retrieved',
                value: {
                  nodes: response.value.suggestionsConnection.nodes.map(parse),
                  endCursor: response.value.suggestionsConnection.endCursor,
                  totalNodes: response.value.suggestionsConnection.totalNodes,
                }
              }
            : response
        )
      )
  }
}
