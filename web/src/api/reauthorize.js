/* @flow */
import { of } from 'rxjs'
import { tap, switchMap, catchError } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { GetRequest } from './index'
import { Storage } from '../storage'
import type { Response } from './index'
import type { User } from '../model/user'
import { UserQuery } from './user-query'

export class ReauthorizeRequest extends GetRequest<'', User> {
  constructor() {
    super('/auth')
  }

  send(params: '' = ''): Observable<Response<User, string>> {
    return super.send('')
      .pipe(
        tap(response => {
          if (response.state === 'retrieved') {
            Storage.store(Storage.Auth, response.value)
          } else if (response.state === 'failed') {
            Storage.remove(Storage.Auth)
            throw { ...response, shouldLogOut: true } // a bit of a hack to prevent a network error from logging out the user. Only authorization failure should cause that
          }
        }),
        switchMap(response => response.state === 'retrieved'
          ? new UserQuery().send()
          : of(response)
        ),
        catchError(of),
      )
  }
}
