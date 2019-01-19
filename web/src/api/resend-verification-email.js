/* @flow */
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { PostRequest } from './index'
import type { Response } from './index'

export class ResendVerificationEmail extends PostRequest<'', boolean> {
  constructor() {
    super('/account/resend-verification')
  }

  send(params: '' = ''): Observable<Response<boolean, string>> {
    return super.send().pipe(catchError(of))
  }
}
