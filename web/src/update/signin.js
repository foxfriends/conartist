/* @flow */
import { defaultModel, model } from '../model'
import { dashboard } from '../model/page'
import type { User } from '../model/user'

export function completeSignIn({ email, name, settings, conventions }: User) {
  model.next({
    ...model.getValue(),
    email,
    name,
    settings: {
      ...defaultModel.settings,
      ...settings,
    },
    conventions,
    dialog: null,
    page: dashboard,
  })
}

export function setUser({ email, name, settings, conventions, prices, products, productTypes }: User) {
  model.next({
    ...model.getValue(),
    email,
    name,
    prices,
    products,
    productTypes,
    settings: {
      ...defaultModel.settings,
      ...settings,
    },
    conventions,
  })
}
