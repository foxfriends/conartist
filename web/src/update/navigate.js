/* @flow */
import { model } from '../model'
import * as page from '../model/page'

export function splash() {
  model.next({ ...model.getValue(), page: page.splash })
}

export function dashboard() {
  model.next({ ...model.getValue(), page: page.dashboard })
}

export function products() {
  model.next({ ...model.getValue(), page: page.products })
}

export function prices() {
  model.next({ ...model.getValue(), page: page.prices })
}

export function conventions() {
  model.next({ ...model.getValue(), page: page.conventions })
}

export function settings() {
  model.next({ ...model.getValue(), page: page.settings })
}
