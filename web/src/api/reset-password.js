/* @flow */
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { PostRequest } from './index'
import type { Response } from './index'

type Params = {|
  code: string,
  password: string,
|}

export class ResetPasswordRequest extends PostRequest<Params, boolean> {
  constructor() {
    super('/account/reset')
  }

  send(params: Params): Observable<Response<boolean, string>> {
    return super.send(params).pipe(catchError(of))
  }
}
