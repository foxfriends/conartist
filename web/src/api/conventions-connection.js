/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  ConventionsConnectionQuery,
  ConventionsConnectionQueryVariables,
} from './schema'
import type { Connection } from '../model/connection'

import { parse } from '../model/meta-convention'
import type { MetaConvention } from '../model/meta-convention'

// $FlowIgnore: trouble importing graphql files
import conventionsConnection from './graphql/query/conventions-connection.graphql'

export type Params = {
  after?: string,
}

export class ConventionsConnection implements APIRequest<Params, Connection<MetaConvention>> {
  conventionsConnection: GraphQLQuery<ConventionsConnectionQueryVariables, ConventionsConnectionQuery>

  constructor() {
    this.conventionsConnection = new GraphQLQuery(conventionsConnection)
  }

  send({ after }: Params = {}): Observable<Response<Connection<MetaConvention>, APIError>> {
    return this.conventionsConnection.send({ after: after || null })
      .pipe(
        map(
          response => response.state === 'retrieved'
            ? {
                state: 'retrieved',
                value: {
                  nodes: response.value.conventionsConnection.nodes.map(parse),
                  endCursor: response.value.conventionsConnection.endCursor,
                  totalNodes: response.value.conventionsConnection.totalNodes,
                }
              }
            : of(response)
        )
      )
  }
}
