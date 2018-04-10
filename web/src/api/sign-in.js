/* @flow */

import { PostRequest } from './index'

type Params = {|
  usr: string,
  psw: string,
|}

export class SignInRequest extends PostRequest<Params, string> {
  constructor() {
    super('/api/auth')
  }
}
