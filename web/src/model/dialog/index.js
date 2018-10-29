/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'
import type { ChangePassword } from './change-password'
import type { Export } from './export'
import type { Import } from './import'

export type Dialog
  = SignUp
  | SignIn
  | ChangePassword
  | Export
  | Import

export type Name = $PropertyType<Dialog, 'name'>
