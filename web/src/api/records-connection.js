/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'

import recordsConnection from './graphql/query/records-connection.graphql'

import type { Response, APIRequest, APIError } from './index'
import type {
  RecordsConnection as RecordsConnectionQuery,
  RecordsConnectionVariables,
} from './schema'
import type { Connection } from '../model/connection'

import { parse } from '../model/record'
import type { Record } from '../model/record'

export type Params = {
  before?: string,
}

export class RecordsConnection implements APIRequest<Params, Connection<Record>> {
  recordsConnection: GraphQLQuery<RecordsConnectionVariables, RecordsConnectionQuery>

  constructor() {
    this.recordsConnection = new GraphQLQuery(recordsConnection)
  }

  send({ before }: Params = {}): Observable<Response<Connection<Record>, APIError>> {
    return this.recordsConnection.send({ before })
      .pipe(map(
        response => response.state === 'retrieved'
          ? {
              state: 'retrieved',
              value: {
                nodes: response.value.recordsConnection.nodes.map(parse),
                endCursor: response.value.recordsConnection.endCursor,
                totalNodes: response.value.recordsConnection.totalNodes,
              }
            }
          : response
      ))
  }
}
