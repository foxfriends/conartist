/* @flow */
import {
  splash,
  dashboard,
  products,
  editProducts,
  editPrices,
  prices,
  sales,
  conventions,
  conventionDetails,
  conventionRecords,
  conventionStats,
  conventionUserInfo,
  searchConventions,
  settings,
  termsOfService,
  privacyPolicy,
  suggestions,
  resetPassword,
  verify,
  faq,
} from '../model/page'
import { LoadConvention } from '../api/load-convention'
import * as navigate from '../update/navigate'
import { setConvention } from '../update/conventions'
import { isSignedIn } from '../util/is-signed-in'
import { PAGE_NO_AUTH } from '../constants'
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
  [ /^\/suggestions\/?$/i, () => suggestions ],
  [ /^\/settings\/?$/i, () => settings ],
  [ /^\/products\/?$/i, () => products ],
  [ /^\/products\/edit\/?$/i, () => editProducts ],
  [ /^\/prices\/?$/i, () => prices ],
  [ /^\/prices\/edit\/?$/i, () => editPrices ],
  [ /^\/sales\/?$/i, () => sales ],
  [ /^\/conventions\/?$/i, () => conventions ],
  [ /^\/conventions\/search\/?$/i, () => searchConventions ],
  [ /^\/terms\/?$/i, () => termsOfService ],
  [ /^\/privacy\/?$/i, () => privacyPolicy ],
  [ /^\/faq\/?$/i, () => faq ],
  [ /^\/reset-password\/([0-9a-fA-F]+)\/?$/i, code => resetPassword(code) ],
  [ /^\/verify\/([0-9a-fA-F]+)\/?$/i, code => verify(code) ],
  [ /^\/convention\/(\d+)\/details\/?$/i, id => conventionDetails(stubConvention(parseInt(id, 10))) ],
  [ /^\/convention\/(\d+)\/records\/?$/i, id => conventionRecords(stubConvention(parseInt(id, 10))) ],
  [ /^\/convention\/(\d+)\/info\/?$/i, id => conventionUserInfo(stubConvention(parseInt(id, 10))) ],
  [ /^\/convention\/(\d+)\/stats\/?$/i, id => conventionStats(stubConvention(parseInt(id, 10))) ],
)

export function resolveRoute(): Page {
  const page = matchUrl(window.location.pathname)
  if (!isSignedIn()) {
    if (page && !PAGE_NO_AUTH.includes(page.name)) {
      window.history.replaceState({ attempted: window.location.pathname }, '', '/')
      return splash
    }
    return page || splash
  }
  if (!page) {
    window.history.replaceState({}, '', '/dashboard')
  }
  return page || dashboard
}
