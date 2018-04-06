/* @flow */
import { showSignupDialog, showSigninDialog } from '../update/splash'
import type { Action } from '../common/button'

export const LogIn: Action = {
  title: 'Sign in',
  action: showSigninDialog,
}

export const SignUp: Action = {
  title: 'Sign up',
  action: showSignupDialog,
}


