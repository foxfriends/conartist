/* @flow */
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { PostRequest } from './index'
import type { Response } from './index'

export class RequestResetPasswordRequest extends PostRequest<{ email: string }, boolean> {
  constructor() {
    super('/auth/reset-password')
  }

  send(email: string): Observable<Response<boolean, string>> {
    return super.send({ email }).pipe(catchError(of))
  }
}
