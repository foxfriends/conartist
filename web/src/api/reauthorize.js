/* @flow */
import { GetRequest } from './index'
import type { Observable } from 'rxjs/Observable'
import type { Response } from './index'
import { Storage } from '../storage'
import 'rxjs/add/operator/do'

export class ReauthorizeRequest extends GetRequest<'', string> {
  constructor() {
    super('/api/auth')
  }

  send(params: '' = ''): Observable<Response<string>> {
    return super.send('')
      .do(response => {
        if (response.state === 'retrieved') {
          Storage.store(Storage.Auth, response.value)
        } else if (response.state === 'failed') {
          Storage.remove(Storage.Auth)
        }
      })
  }
}
