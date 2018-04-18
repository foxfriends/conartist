/* @flow */
import { GetRequest } from './index'

export class EmailInUseRequest extends GetRequest<string, boolean> {
  constructor() {
    super('/api/account/exists')
  }
}
