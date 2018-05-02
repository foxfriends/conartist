/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'
import type { ChangePassword } from './change-password'
import type { Export } from './export'

export type Dialog
  = SignUp
  | SignIn
  | ChangePassword
  | Export

export type Name = $PropertyType<Dialog, 'name'>
