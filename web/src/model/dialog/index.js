/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'
import type { ChangePassword } from './change-password'
import type { Export } from './export'
import type { Import } from './import'
import type { ResetPassword } from './reset-password'

export type Dialog
  = SignUp
  | SignIn
  | ChangePassword
  | Export
  | Import
  | ResetPassword

export type Name = $PropertyType<Dialog, 'name'>
