/* @flow */
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Storage } from '../storage'
import { splash, dashboard } from './page'
import { ReauthorizeRequest } from '../api/reauthorize'
import type { Page } from './page'
import type { Dialog } from './dialog'
import 'rxjs/add/operator/filter'

export type ProductType = {}
export type Price = {}
export type Product = {}
export type Convention = {}

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

type Currency = 'CAD' | 'USD'

export type Settings = {
  language: string,
  currency: Currency,
}

const defaultModel: Model = {
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
      .filter(response => response.state === 'failed')
      .subscribe(_ => {
        // TODO: include an error dialog when this happens
        // $FlowIgnore: not good enough at spread
        model.next({ ...model.getValue(), page: splash })
      })
  }
  // $FlowIgnore: not good enough at spread
  return {
    ...defaultModel,
    page,
  }
}

export const model: BehaviorSubject<$ReadOnly<Model>> = new BehaviorSubject(init())
