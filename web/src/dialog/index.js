/* @flow */
import * as React from 'react'
import { Loading } from './loading'

const Export = React.lazy(() => import(/* webpackChunkName: 'export' */ './export'))
const Import = React.lazy(() => import(/* webpackChunkName: 'import' */ './import'))

const SignIn = React.lazy(() => import(/* webpackChunkName: 'signin' */ './signin'))
const ResetPassword = React.lazy(() => import(/* webpackChunkName: 'signin' */ './reset-password'))

const SignUp = React.lazy(() => import(/* webpackChunkName: 'signup' */ './signup'))

const ChangePassword = React.lazy(() => import(/* webpackChunkName: 'settings' */ './change-password'))
const ChangeEmail = React.lazy(() => import(/* webpackChunkName: 'settings' */ './change-email'))
const ChangeName = React.lazy(() => import(/* webpackChunkName: 'settings' */ './change-name'))
const ChangeCurrency = React.lazy(() => import(/* webpackChunkName: 'settings' */ './change-currency'))
const ChangeLanguage = React.lazy(() => import(/* webpackChunkName: 'settings' */ './change-language'))

const CreateSuggestion = React.lazy(() => import(/* webpackChunkName: 'suggestions' */ './create-suggestion'))

const NewSale = React.lazy(() => import(/* webpackChunkName: 'sales' */ './new-sale'))
const NewExpense = React.lazy(() => import(/* webpackChunkName: 'sales' */ './new-expense'))

import type { Props as SignUpProps } from './signup'
import type { Props as SignInProps } from './signin'
import type { Props as ChangePasswordProps } from './change-password'
import type { Props as ChangeEmailProps } from './change-email'
import type { Props as ChangeNameProps } from './change-name'
import type { Props as ChangeCurrencyProps } from './change-currency'
import type { Props as ChangeLanguageProps } from './change-language'
import type { Props as ResetPasswordProps } from './reset-password'
import type { Props as CreateSuggestionProps } from './create-suggestion'
import type { Props as ExportProps } from './export'
import type { Props as ImportProps } from './import'
import type { Props as NewSaleProps } from './new-sale'
import type { Props as NewExpenseProps } from './new-expense'

import S from './index.css'

const { Suspense } = React

export type Props
  = SignUpProps
  | SignInProps
  | ChangePasswordProps
  | ChangeEmailProps
  | ChangeNameProps
  | ChangeCurrencyProps
  | ChangeLanguageProps
  | ResetPasswordProps
  | CreateSuggestionProps
  | NewSaleProps
  | NewExpenseProps
  | ExportProps
  | ImportProps

export function Dialog(props: Props) {
  let dialog: React.Node;

  switch (props.name) {
    case 'signup':
      dialog = <SignUp {...props} />
      break
    case 'signin':
      dialog = <SignIn {...props} />
      break
    case 'change-password':
      dialog = <ChangePassword {...props} />
      break
    case 'change-email':
      dialog = <ChangeEmail {...props} />
      break
    case 'change-name':
      dialog = <ChangeName {...props} />
      break
    case 'change-language':
      dialog = <ChangeLanguage {...props} />
      break
    case 'change-currency':
      dialog = <ChangeCurrency {...props} />
      break
    case 'reset-password':
      dialog = <ResetPassword {...props} />
      break
    case 'create-suggestion':
      dialog = <CreateSuggestion {...props} />
      break
    case 'export':
      dialog = <Export {...props} />
      break
    case 'import':
      dialog = <Import {...props} />
      break
    case 'new-sale':
      dialog = <NewSale {...props} />
      break
    case 'new-expense':
      dialog = <NewExpense {...props} />
      break
  }

  return (
    <div className={S.backdrop}>
      <Suspense fallback={<Loading />}>{ dialog }</Suspense>
    </div>
  )
}
