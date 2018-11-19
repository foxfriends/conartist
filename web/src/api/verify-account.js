/* @flow */
import { of } from 'rxjs'
import { tap, switchMap, catchError } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { PostRequest } from './index'
import { Storage } from '../storage'
import type { Response } from './index'
import type { User } from '../model/user'
import { UserQuery } from './user-query'

export class VerifyAccountRequest extends PostRequest<string, boolean> {
  constructor() {
    super('/api/account/verify')
  }

  send(code: string): Observable<Response<boolean, string>> {
    return super.send({ code }).pipe(catchError(of))
  }
}
