/* @flow */
import { List } from 'immutable'
import { BehaviorSubject } from 'rxjs/Observable'
import * as page from './page'
import type { Page } from './page'
import type { Dialog } from './dialog'

export type ProductType = {}
export type Price = {}
export type Product = {}
export type Convention = {}

export type Model = {|
  email: ?string,
  name: ?string,
  prices: List<Price>,
  productTypes: List<ProductType>,
  products: List<Product>,
  conventions: List<Convention>,
  page: Page,
  dialog: ?Dialog,
  settings: Settings,
|}

type Currency = 'CAD' | 'USD'

export type Settings = {
  language: String,
  currency: Currency,
}

export const model: BehaviorSubject<$ReadOnly<Model>> = BehaviorSubject({
  email: null,
  name: null,
  prices: List(),
  productTypes: List(),
  products: List(),
  conventions: List(),
  page: page.splash,
  dialog: null,
})
