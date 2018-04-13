/* @flow */
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Storage } from '../storage'
import { splash, dashboard } from './page'
import { ReauthorizeRequest } from '../api/reauthorize'
import type { Page } from './page'
import type { Dialog } from './dialog'
import type { Product } from './product'
import type { ProductType } from './product-type'
import type { Convention } from './convention'
import type { Price } from './price'
import type { Settings } from './settings'
import * as navigate from '../update/navigate'
import { setUser } from '../update/signin'
import 'rxjs/add/operator/filter'

export type Model = {|
  email: ?string,
  name: ?string,
  prices: Price[],
  productTypes: ProductType[],
  products: Product[],
  conventions: Convention[],
  page: Page,
  dialog: ?Dialog,
  settings: Settings,
|}

export const defaultModel: Model = {
  email: null,
  name: null,
  prices: [],
  productTypes: [],
  products: [],
  conventions: [],
  page: splash,
  dialog: null,
  settings: {
    language: 'en',
    currency: 'CAD',
  },
}

function init(): Model {
  const page = Storage.retrieve(Storage.Auth)
    ? dashboard
    : splash
  if (page.name === 'dashboard') {
    new ReauthorizeRequest()
      .send()
      .subscribe(response => {
        switch (response.state) {
          case 'failed':
            // TODO: include an error dialog when this happens
            // $FlowIgnore: not good enough at spread
            navigate.splash()
            break
          case 'retrieved':
            setUser(response.value)
        }
      })
  }
  // $FlowIgnore: not good enough at spread
  return {
    ...defaultModel,
    page,
  }
}

export const model: BehaviorSubject<$ReadOnly<Model>> = new BehaviorSubject(init())
