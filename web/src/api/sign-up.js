/* @flow */

import { PostRequest } from './index'

type Params = {|
  name: string,
  email: string,
  password: string,
|}

export class SignUpRequest extends PostRequest<Params, string> {
  constructor() {
    super('/api/account/new')
  }
}
