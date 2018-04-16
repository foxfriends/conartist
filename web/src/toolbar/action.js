/* @flow */
import { showSignupDialog, showSigninDialog } from '../update/splash'
import * as navigate from '../update/navigate'
import type { Action } from '../common/button'

export const LogIn: Action = {
  title: 'Sign in',
  action: showSigninDialog,
}

export const SignUp: Action = {
  title: 'Sign up',
  action: showSignupDialog,
}

export const EditProducts: Action = {
  title: 'Edit',
  action: navigate.editProducts,
}

export const Discard: Action = {
  title: 'Discard',
  action: navigate.products,
}

export const Save: Action = {
  title: 'Save',
  action: navigate.products,
}
