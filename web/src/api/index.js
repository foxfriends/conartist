/*       */
import { Observable } from 'rxjs'
                                                          
import { graphql } from './apollo'

import { Storage } from '../storage'
import { APIURL } from '../constants'

                                                                        
                                        
                                                            
                                                     
                                                           
                                   
export const unsent = { state: 'unsent' }

                                             
                                                              
 

                             

class HttpRequest                 {
  route        
  method        

  constructor(method        , route        , authorization          ) {
    this.route = route
    this.method = method
  }

  _send(request         )                                         {
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

export class PostRequest                 extends HttpRequest                                                       {
  constructor(route        , authorization          ) {
    super('POST', route, authorization)
  }

  send(params        )                                         {
    const body = JSON.stringify(params)
    return super._send(new Request(`${APIURL}${this.route}`, { method: 'POST', body }))
  }
}

export class GetRequest                 extends HttpRequest                                                       {
  constructor(route        , authorization          ) {
    super('GET', route, authorization)
  }

  send(params        )                                         {
    let query         = ''
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
    return super._send(new Request(`${APIURL}${this.route}${query.length > 1 ? query : ''}`))
  }
}

export class GraphQLQuery                                                           {
  query                         

  constructor(query                         ) {
    this.query = query
  }

  send(variables           )                                        {
    return Observable.create(observer => {
      (async () => {
        observer.next({ state: 'sending', progress: 0 })
        try {
          const result = await graphql.query({ query: this.query, variables, fetchPolicy: 'no-cache' })
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

export class GraphQLMutation                                                           {
  mutation                            

  constructor(mutation                            ) {
    this.mutation = mutation
  }

  send(variables           )                                        {
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
