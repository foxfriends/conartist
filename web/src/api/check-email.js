/* @flow */

import { GetRequest } from './index'

type Params = string

export class CheckEmailRequest extends GetRequest<Params, string> {
  constructor() {
    super('/api/account/exists')
  }
}
