/* @flow */
import { defaultModel, model } from '../model'
import { dashboard } from '../model/page'
import type { User } from '../model/user'

export function completeSignIn({ email, name, verified, clearance, settings, conventions, prices, products, productTypes }: User) {
  model.next({
    ...model.getValue(),
    user: {
      email,
      name,
      verified,
      clearance,
    },
    prices,
    products,
    productTypes,
    conventions,
    settings: {
      ...defaultModel.settings,
      ...settings,
    },
    dialog: null,
    page: dashboard,
  })
}

export function setUser({ email, name, verified, clearance, settings, conventions, prices, products, productTypes }: User) {
  model.next({
    ...model.getValue(),
    user: {
      email,
      name,
      verified,
      clearance,
    },
    prices,
    products,
    productTypes,
    conventions,
    settings: {
      ...defaultModel.settings,
      ...settings,
    },
  })
}
