/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'
import type { ChangePassword } from './change-password'

export type Dialog
  = SignUp
  | SignIn
  | ChangePassword

export type Name = $PropertyType<Dialog, 'name'>
