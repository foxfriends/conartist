/* @flow */
import { model } from '../model'
import * as page from '../model/page'
import { LoadConvention } from '../api/load-convention'
import type { Convention } from '../model/convention'
import type { Page } from '../model/page'
import { setConvention } from '../update/conventions'

function loadConvention(conId: number) {
  new LoadConvention()
    .send({ conId })
    .toPromise()
    .then(response => {
      if(response.state === 'retrieved') {
        return response.value
      }
      throw new Error()
    })
    .then(setConvention)
    .catch(conventions)
}

function goTo(name, page) {
  return () => {
    if (model.getValue().page !== page) {
      window.history.pushState({}, '', name)
    }
    model.next({ ...model.getValue(), page })
  }
}

export const splash = goTo('/', page.splash)
export const dashboard = goTo('/dashboard', page.dashboard)
export const editProducts = goTo('/products/edit', page.editProducts)
export const products = goTo('/products', page.products)
export const editPrices = goTo('/prices/edit', page.editPrices)
export const prices = goTo('/prices', page.prices)
export const conventions = goTo('/conventions', page.conventions)
export const searchConventions = goTo('/conventions/search', page.searchConventions)
export const settings = goTo('/settings', page.settings)
export const suggestions = goTo('/suggestions', page.suggestions)
export const admin = goTo('/admin', page.admin)
export const privacy = goTo('/privacy', page.privacyPolicy)
export const terms = goTo('/terms', page.termsOfService)
export const faq = goTo('/faq', page.faq)

export function conventionDetails(convention: Convention) {
  const { page: currentPage } = model.getValue()
  if (currentPage.name !== 'convention-details' || currentPage.convention.id !== convention.id) {
    window.history.pushState({}, '', `/convention/${convention.id}/details`)
  }
  loadConvention(convention.id)
  model.next({ ...model.getValue(), page: page.conventionDetails(convention) })
}

export function conventionRecords(convention: Convention) {
  const { page: currentPage } = model.getValue()
  if (currentPage.name !== 'convention-records' || currentPage.convention.id !== convention.id) {
    window.history.pushState({}, '', `/convention/${convention.id}/records`)
  }
  loadConvention(convention.id)
  model.next({ ...model.getValue(), page: page.conventionRecords(convention) })
}

export function conventionStats(convention: Convention) {
  const { page: currentPage } = model.getValue()
  if (currentPage.name !== 'convention-stats' || currentPage.convention.id !== convention.id) {
    window.history.pushState({}, '', `/convention/${convention.id}/stats`)
  }
  loadConvention(convention.id)
  model.next({ ...model.getValue(), page: page.conventionStats(convention) })
}

export function conventionUserInfo(convention: Convention) {
  const { page: currentPage } = model.getValue()
  if (currentPage.name !== 'convention-user-info' || currentPage.convention.id !== convention.id) {
    window.history.pushState({}, '', `/convention/${convention.id}/info`)
  }
  loadConvention(convention.id)
  model.next({ ...model.getValue(), page: page.conventionUserInfo(convention) })
}

export type ScrollTarget = 'product-type'

export function scrollIdentifier(target: ScrollTarget, id: number | string) {
  return `scroll-to-${target}-${id}`
}

export function scrollTo(target: ScrollTarget, id: number | string): () => void {
  return () => {
    const element = document.querySelector(`#${scrollIdentifier(target, id)}`)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
}

export function to(page: Page) {
  model.next({ ...model.getValue(), page })
}
