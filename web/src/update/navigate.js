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

export function to(page: Page) {
  model.next({ ...model.getValue(), page })
}
