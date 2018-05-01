/* @flow */
import { Observable } from 'rxjs/Observable'
import type { Operation, Query, Mutation } from './apollo'
import { graphql } from './apollo'

import { Storage } from '../storage'

export type Response<T, E> = Unsent | Sending | Failed<E> | Retrieved<T>
export type Unsent = { state: 'unsent' }
export type Sending = { state: 'sending', progress: number }
export type Failed<E> = { state: 'failed', error: E }
export type Retrieved<T> = { state: 'retrieved', value: T }
export type Method = 'GET' | 'POST'
export const unsent = { state: 'unsent' }

export interface APIRequest<Params, Result> {
  send(params: Params): Observable<Response<Result, APIError>>
}

export type APIError = string

class HttpRequest<Params, Result> {
  route: string
  method: Method

  constructor(method: Method, route: string, authorization?: ?string) {
    this.route = route
    this.method = method
  }

  _send(request: Request): Observable<Response<Result, APIError>> {
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

export class PostRequest<Params, Result> extends HttpRequest<Params, Result> implements APIRequest<Params, Result> {
  constructor(route: string, authorization?: ?string) {
    super('POST', route, authorization)
  }

  send(params: Params): Observable<Response<Result, APIError>> {
    const body = JSON.stringify(params)
    return super._send(new Request(this.route, { method: 'POST', body }))
  }
}

export class GetRequest<Params, Result> extends HttpRequest<Params, Result> implements APIRequest<Params, Result> {
  constructor(route: string, authorization?: ?string) {
    super('GET', route, authorization)
  }

  send(params: Params): Observable<Response<Result, APIError>> {
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

export class GraphQLQuery<Variables, Value> implements APIRequest<Variables, Value> {
  query: Query<Variables, Value>

  constructor(query: Query<Variables, Value>) {
    this.query = query
  }

  send(variables: Variables): Observable<Response<Value, APIError>> {
    return Observable.create(observer => {
      (async () => {
        observer.next({ state: 'sending', progress: 0 })
        try {
          const result = await graphql.query({ query: this.query, variables })
          observer.next({ state: 'retrieved', value: result.data })
        } catch(result) {
          console.error(result)
          if (result.networkError) {
            const error = 'GraphQL error:\n' + JSON.stringify(result.networkError)
            observer.next({ state: 'failed', error })
          } else if (result.graphQLErrors) {
            const error = 'GraphQL error:\n' + JSON.stringify(result.graphQLErrors)
            observer.next({ state: 'failed', error })
          }
        } finally {
          observer.complete()
        }
      })()
    })
  }
}

export class GraphQLMutation<Variables, Value> implements APIRequest<Variables, Value> {
  mutation: Mutation<Variables, Value>

  constructor(mutation: Mutation<Variables, Value>) {
    this.mutation = mutation
  }

  send(variables: Variables): Observable<Response<Value, APIError>> {
    return Observable.create(observer => {
      (async () => {
        observer.next({ state: 'sending', progress: 0 })
        try {
          const result = await graphql.mutate({ mutation: this.mutation, variables })
          observer.next({ state: 'retrieved', value: result.data })
        } catch(result) {
          console.error(result)
          if (result.networkError) {
            const error = 'GraphQL error:\n' + JSON.stringify(result.networkError)
            observer.next({ state: 'failed', error })
          } else if (result.graphQLErrors) {
            const error = 'GraphQL error:\n' + JSON.stringify(result.graphQLErrors)
            observer.next({ state: 'failed', error })
          }
        } finally {
          observer.complete()
        }
      })()
    })
  }
}
