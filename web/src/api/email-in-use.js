/* @flow */
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import { GetRequest } from './index'
import { Storage } from '../storage'
import type { Response } from './index'
import type { User } from '../model/user'
import { UserQuery } from './user-query'

export class EmailInUseRequest extends GetRequest<string, boolean> {
  constructor() {
    super('/api/account/exists')
  }
}
