/* @flow */

export type Response<T> = Unsent | Sent | Failed | Retrieved<T>
export type Unsent = { state: 'unsent' }
export type Sent = { state: 'sent', progress: number }
export type Failed = { state: 'failed', error: string }
export type Retrieved<T> = { state: 'retrieved', value: T }

export type Method = 'GET' | 'POST' | 'GraphQL'

class _Request<Params: Object, T> {
  route: string
  method: Method
  authorization: ?string

  constructor(method: Method, route: string, authorization?: ?string) {
    this.route = route
    this.method = method
    this.authorization = authorization
  }

  _send(request: Request): Promise<Response<T>> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8',
    })
    if (this.authorization) {
      headers.append('Authorization', `Bearer: ${this.authorization}`)
    }
    return fetch(new Request(request, { method: this.method, headers }))
      .then(response => response.ok 
        ? response.json().then(value => ({ state: 'retrieved', value }))
        : { state: 'failed', error: response.statusText })
      .catch(error => ({ state: 'failed', error }))
  }
}

export class PostRequest<Params: Object, T> extends _Request<Params, T> {
  constructor(route: string, authorization?: ?string) {
    super('POST', route, authorization)
  }

  send(params: Params): Promise<Response<T>> {
    let body = JSON.stringify(params)
    return super._send(new Request(this.route, { method: 'POST', body }))
  }
}

export class GetRequest<Params: Object, T> extends _Request<Params, T> {
  constructor(route: string, authorization?: ?string) {
    super('GET', route, authorization)
  }

  send(params: Params): Promise<Response<T>> {
    let query = '?' + Object.entries(params)
      // $FlowIgnore: Poorly typed implementation of Object.entries...
      .map(([key, value]) => [key, `${value}`])
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    return super._send(new Request(`${this.route}${query.length > 1 ? query : ''}`))
  }
}
