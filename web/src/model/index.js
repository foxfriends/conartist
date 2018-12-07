/* @flow */
import * as React from 'react'
import { BehaviorSubject } from 'rxjs'

import { Storage } from '../storage'
import { splash, dashboard } from './page'
import { empty } from './connection'
import { ReauthorizeRequest } from '../api/reauthorize'
import * as toast from '../toast'
import { setUser } from '../update/signin'
import { signOut } from '../update/settings'
import { resolveRoute } from '../routing'
import { l } from '../localization'
import type { Page } from './page'
import type { Dialog } from './dialog'
import type { Product } from './product'
import type { ProductType } from './product-type'
import type { Convention } from './convention'
import type { Price } from './price'
import type { Settings } from './settings'

export type Model = {|
  user: ?{
    email: string,
    name: string,
    clearance: number,
  },
  prices: Price[],
  productTypes: ProductType[],
  products: Product[],
  conventions: Convention[],
  page: Page,
  dialog: ?Dialog,
  settings: Settings,
  suggestions: Suggestion[],
|}

export const defaultModel: Model = {
  user: null,
  prices: [],
  productTypes: [],
  products: [],
  conventions: [],
  page: splash,
  dialog: null,
  suggestions: empty(),
  settings: {
    language: Storage.retrieve(Storage.Language) || 'en-ca',
    currency: 'CAD',
  },
}

function init(): Model {
  const page = resolveRoute()
  if (page.name !== 'splash') {
    new ReauthorizeRequest()
      .send()
      .subscribe(response => {
        switch (response.state) {
          case 'failed':
            toast.show(<span>{l`Uh oh. You have been logged out!`}</span>)
            // $FlowIgnore: not good enough at spread
            signOut()
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
