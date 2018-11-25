/* @flow */
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { PostRequest } from './index'
import type { Response } from './index'

export class VerifyAccountRequest extends PostRequest<{ code: string }, boolean> {
  constructor() {
    super('/account/verify')
  }

  send(code: string): Observable<Response<boolean, string>> {
    return super.send({ code }).pipe(catchError(of))
  }
}
