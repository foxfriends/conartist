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
import type { NewSale } from './new-sale'
import type { NewExpense } from './new-expense'

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
  | NewExpense
  | NewSale

export type Name = $PropertyType<Dialog, 'name'>
