/* @flow */
import { model } from '../model'
import * as page from '../model/page'
import type { Page } from '../model/page'

export function splash() {
  if (model.getValue().page !== page.dashboard) {
    window.history.pushState({}, '', '/')
  }
  model.next({ ...model.getValue(), page: page.splash })
}

export function dashboard() {
  if (model.getValue().page !== page.dashboard) {
    window.history.pushState({}, '', '/dashboard')
  }
  model.next({ ...model.getValue(), page: page.dashboard })
}

export function editProducts() {
  if (model.getValue().page !== page.editProducts) {
    window.history.pushState({}, '', '/products/edit')
  }
  model.next({ ...model.getValue(), page: page.editProducts })
}

export function products() {
  if (model.getValue().page !== page.products) {
    window.history.pushState({}, '', '/products')
  }
  model.next({ ...model.getValue(), page: page.products })
}

export function editPrices() {
  if (model.getValue().page !== page.editPrices) {
    window.history.pushState({}, '', '/prices/edit')
  }
  model.next({ ...model.getValue(), page: page.editPrices })
}

export function prices() {
  if (model.getValue().page !== page.prices) {
    window.history.pushState({}, '', '/prices')
  }
  model.next({ ...model.getValue(), page: page.prices })
}

export function conventions() {
  if (model.getValue().page !== page.conventions) {
    window.history.pushState({}, '', '/conventions')
  }
  model.next({ ...model.getValue(), page: page.conventions })
}

export function settings() {
  if (model.getValue().page !== page.settings) {
    window.history.pushState({}, '', '/settings')
  }
  model.next({ ...model.getValue(), page: page.settings })
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
