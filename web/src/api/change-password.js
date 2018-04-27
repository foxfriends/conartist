/* @flow */
import type { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { tap, switchMap, catchError } from 'rxjs/operators'

import { PostRequest } from './index'
import { Storage } from '../storage'
import type { Response } from './index'

type Params = {|
  old: string,
  new: string,
|}

export class ChangePasswordRequest extends PostRequest<Params, boolean> {
  constructor() {
    super('/api/auth/change-password')
  }
}
