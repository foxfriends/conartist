/* @flow */
import { showSignupDialog, showSigninDialog } from '../update/splash'
import * as navigate from '../update/navigate'
import { send, SaveProducts as SaveProductsEvent, SavePrices as SavePricesEvent } from '../event'
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

export const DiscardProducts: Action = {
  title: 'Discard',
  action: navigate.products,
}

export const SaveProducts: Action = {
  title: 'Save',
  action: () => send(SaveProductsEvent),
}

export const EditPrices: Action = {
  title: 'Edit',
  action: navigate.editPrices,
}

export const DiscardPrices: Action = {
  title: 'Discard',
  action: navigate.prices,
}

export const SavePrices: Action = {
  title: 'Save',
  action: () => send(SavePricesEvent),
}

export const SearchConventions: Action = {
  title: 'Search',
  action: navigate.searchConventions,
}
