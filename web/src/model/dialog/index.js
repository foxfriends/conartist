/* @flow */
import type { SignUp } from './signup'
import type { SignIn } from './signin'
import type { ChangePassword } from './change-password'
import type { ChangeEmail } from './change-email'
import type { ChangeName } from './change-name'
import type { ChangeCurrency } from './change-currency'
import type { ChangeLanguage } from './change-language'
import type { Export } from './export'
import type { Import } from './import'
import type { ResetPassword } from './reset-password'
import type { CreateSuggestion } from './create-suggestion'

export type Dialog
  = SignUp
  | SignIn
  | ChangePassword
  | ChangeEmail
  | ChangeName
  | ChangeCurrency
  | ChangeLanguage
  | Export
  | Import
  | ResetPassword
  | CreateSuggestion

export type Name = $PropertyType<Dialog, 'name'>
