/* @flow */
import type { Observable } from 'rxjs'
import { of } from 'rxjs'
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
