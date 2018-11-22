/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'
import type { ChangePassword } from './change-password'
import type { ChangeEmail } from './change-email'
import type { changeName } from './change-name'
import type { Export } from './export'
import type { Import } from './import'
import type { ResetPassword } from './reset-password'

export type Dialog
  = SignUp
  | SignIn
  | ChangePassword
  | ChangeEmail
  | ChangeName
  | Export
  | Import
  | ResetPassword

export type Name = $PropertyType<Dialog, 'name'>
