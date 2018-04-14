/* @flow */
import { Observable } from 'rxjs/Observable'
import ApolloClient from 'apollo-boost'
import type { Operation, Query, Mutation } from 'apollo-boost'
import { Storage } from '../storage'

export type Response<T> = Unsent | Sending | Failed | Retrieved<T>
export type Unsent = { state: 'unsent' }
export type Sending = { state: 'sending', progress: number }
export type Failed = { state: 'failed', error: string }
export type Retrieved<T> = { state: 'retrieved', value: T }
export type Method = 'GET' | 'POST'
export const unsent = { state: 'unsent' }

class _Request<Params, T> {
  route: string
  method: Method

  constructor(method: Method, route: string, authorization?: ?string) {
    this.route = route
    this.method = method
  }

  _send(request: Request): Observable<Response<T>> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8',
    })
    const authorization = Storage.retrieve(Storage.Auth)
    if (authorization) {
      headers.append('Authorization', `Bearer ${authorization}`)
    }
    return Observable.create(observer => {
      (async () => {
        observer.next({ state: 'sending', progress: 0 })
        const result = await fetch(new Request(request, { method: this.method, headers }))
          .then(response => response.ok 
            ? response
              .json()
              .then(result => result.status === 'Success' 
                ? { state: 'retrieved', value: result.data }
                : { state: 'failed', error: result.error }
              )
            : { state: 'failed', error: response.statusText })
          .catch(error => ({ state: 'failed', error }))
        observer.next(result)
        observer.complete()
      })()
    })
  }
}

export class PostRequest<Params, T> extends _Request<Params, T> {
  constructor(route: string, authorization?: ?string) {
    super('POST', route, authorization)
  }

  send(params: Params): Observable<Response<T>> {
    const body = JSON.stringify(params)
    return super._send(new Request(this.route, { method: 'POST', body }))
  }
}

export class GetRequest<Params, T> extends _Request<Params, T> {
  constructor(route: string, authorization?: ?string) {
    super('GET', route, authorization)
  }

  send(params: Params): Observable<Response<T>> {
    let query: string = '' 
    if (typeof params === 'string') {
      query = `/${params}`
    } else if (params instanceof Array) {
      query = '/' + params.join('/')
    } else if (params instanceof Object) {
      query = '?' + Object.entries(params)
        // $FlowIgnore: Poorly typed implementation of Object.entries...
        .map(([key, value]) => [key, `${value}`])
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    }
    return super._send(new Request(`${this.route}${query.length > 1 ? query : ''}`))
  }
}

const graphql = new ApolloClient({
  uri: '/api/v2/',
  async request(operation: Operation) {
    const authorization = Storage.retrieve(Storage.Auth)
    if (authorization) {
      const headers = { Authorization: `Bearer ${authorization}` }
      operation.setContext({ headers })
    }
  },
})

export class GraphQLQuery<Variables, T: Object, K: $Keys<T>> {
  query: Query<Variables, T>
  root: K

  constructor(query: Query<Variables, T>, root: K) {
    this.query = query
    this.root = root
  }

  send(variables: Variables): Observable<Response<$ElementType<T, K>>> {
    return Observable.create(observer => {
      (async () => {
        observer.next({ state: 'sending', progress: 0 })
        try {
          const result = await graphql.query({ query: this.query, variables })
          observer.next({ state: 'retrieved', value: result.data[this.root] })
        } catch(result) {
          if (result.networkError) {
            const error = 'GraphQL error:\n' + result.networkError.result.errors.map(error => error.message).join(',\n')
            observer.next({ state: 'failed', error })
          } else if (result.graphQLErrors) {
            const error = 'GraphQL error:\n' + result.graphQLErrors.map(error => error.message).join(',\n')
            observer.next({ state: 'failed', error })
          }
        } finally {
          observer.complete()
        }
      })()
    })
  }
}

export class GraphQLMutation<Variables, T> {
  mutation: Mutation<Variables, T>

  constructor(mutation: Mutation<Variables, T>) {
    this.mutation = mutation
  }

  send(variables: Variables): Observable<Response<T>> {
    return Observable.create(observer => {
      (async () => {
        observer.next({ state: 'sending', progress: 0 })
        try {
          const result = await graphql.mutation({ mutation: this.mutation, variables })
          observer.next({ state: 'retrieved', value: result.data })
        } catch(result) {
          if (result.networkError) {
            const error = 'GraphQL error:\n' + result.networkError.result.errors.map(error => error.message).join(',\n')
            observer.next({ state: 'failed', error })
          } else if (result.graphQLErrors) {
            const error = 'GraphQL error:\n' + result.graphQLErrors.map(error => error.message).join(',\n')
            observer.next({ state: 'failed', error })
          }
        } finally {
          observer.complete()
        }
      })()
    })
  }
}
