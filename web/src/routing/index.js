/* @flow */
import {
  splash,
  dashboard,
  products,
  editProducts,
  editPrices,
  prices,
  conventions,
  conventionDetails,
  conventionRecords,
  conventionUserInfo,
  searchConventions,
  settings,
} from '../model/page'
import { Storage } from '../storage'
import { LoadConvention } from '../api/load-convention'
import * as navigate from '../update/navigate'
import { setConvention } from '../update/conventions'
import type { Page } from '../model/page'
import type { MetaConvention } from '../model/meta-convention'

function match<T>(...matchers: [RegExp, (text: string, ...matches: string[]) => T][]): (text: string) => ?T {
  return text => {
    for (const [pattern, handler] of matchers) {
      const matches = text.match(pattern)
      if (matches) {
        return handler(...matches.slice(1))
      }
    }
  }
}

function stubConvention(id: number): MetaConvention {
  new LoadConvention()
    .send({ conId: id })
    .toPromise()
    .then(response => {
      if(response.state === 'retrieved') {
        return response.value
      }
      throw new Error()
    })
    .then(setConvention)
    .catch(() => navigate.conventions())

  return {
    id,
    name: '',
    start: new Date(0),
    end: new Date(0),
    extraInfo: [],
    userInfo: [],
    images: [],
    recordTotal: null,
    expenseTotal: null,
  }
}

const matchUrl = match(
  [ /^\/dashboard\/?$/i, () => dashboard ],
  [ /^\/settings\/?$/i, () => settings ],
  [ /^\/products\/?$/i, () => products ],
  [ /^\/products\/edit\/?$/i, () => editProducts ],
  [ /^\/prices\/?$/i, () => prices ],
  [ /^\/prices\/edit\/?$/i, () => editPrices ],
  [ /^\/conventions\/?$/i, () => conventions ],
  [ /^\/conventions\/search\/?$/i, () => searchConventions ],
  [ /^\/convention\/(\d+)\/details\/?$/i, id => conventionDetails(stubConvention(parseInt(id, 10))) ],
  [ /^\/convention\/(\d+)\/records\/?$/i, id => conventionRecords(stubConvention(parseInt(id, 10))) ],
  [ /^\/convention\/(\d+)\/info\/?$/i, id => conventionUserInfo(stubConvention(parseInt(id, 10))) ],
)

export function resolveRoute(): Page {
  if (!Storage.retrieve(Storage.Auth)) {
    window.history.replaceState({ attempted: window.location.pathname }, '', '/')
    return splash
  }
  const page = matchUrl(window.location.pathname)
  if (!page) {
    window.history.replaceState({}, '', '/dashboard')
  }
  return page || dashboard
}
