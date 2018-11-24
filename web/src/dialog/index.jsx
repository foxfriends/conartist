/* @flow */
import * as React from 'react'
import { SignUp } from './signup'
import { SignIn } from './signin'
import { ChangePassword } from './change-password'
import { ChangeEmail } from './change-email'
import { ChangeName } from './change-name'
import { ChangeCurrency } from './change-currency'
import { ChangeLanguage } from './change-language'
import { ResetPassword } from './reset-password'
import { Export } from './export'
import { Import } from './import'
import type { Props as SignUpProps } from './signup'
import type { Props as SignInProps } from './signin'
import type { Props as ChangePasswordProps } from './change-password'
import type { Props as ChangeEmailProps } from './change-email'
import type { Props as ChangeNameProps } from './change-name'
import type { Props as ChangeCurrencyProps } from './change-currency'
import type { Props as ChangeLanguageProps } from './change-language'
import type { Props as ResetPasswordProps } from './reset-password'
import type { Props as ExportProps } from './export'
import type { Props as ImportProps } from './import'

import S from './index.css'

export type Props
  = SignUpProps
  | SignInProps
  | ChangePasswordProps
  | ChangeEmailProps
  | ChangeNameProps
  | ChangeCurrencyProps
  | ChangeLanguageProps
  | ResetPasswordProps
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
    case 'export':
      dialog = <Export {...props} />
      break
    case 'import':
      dialog = <Import {...props} />
      break
  }

  return (
    <div className={S.backdrop}>
      { dialog }
    </div>
  )
}
