/* @flow */
import type { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
import type { Response, APIRequest, APIError } from './index'
import type {
  ConventionsConnection as ConventionsConnectionQuery,
  ConventionsConnectionVariables,
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
  conventionsConnection: GraphQLQuery<ConventionsConnectionVariables, ConventionsConnectionQuery>

  constructor() {
    this.conventionsConnection = new GraphQLQuery(conventionsConnection)
  }

  send({ search, after }: Params = {}): Observable<Response<Connection<MetaConvention>, APIError>> {
    return this.conventionsConnection.send({ search: search || null, after: after || null })
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
            : response
        )
      )
  }
}
