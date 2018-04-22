/* @flow */
import { splash, dashboard, products, editProducts, editPrices, prices, conventions, searchConventions, settings } from '../model/page'
import { Storage } from '../storage'
import type { Page } from '../model/page'

function match<T>(...matchers: [RegExp, (text: string, ...matches: string[]) => T][]): (text: string) => ?T {
  return text => {
    for (const [pattern, handler] of matchers) {
      const matches = text.match(pattern)
      if (matches) {
        return handler(text, ...matches)
      }
    }
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
  [ /^\/convention\/(\d+)\/details?$/i, () => conventions ],
  [ /^\/convention\/(\d+)\/records\/?$/i, () => conventions ],
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
