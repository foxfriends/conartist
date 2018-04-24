/* @flow */
import { model } from '../model'
import type { Price } from '../model/price'

export function setPrices(prices: Price[]) {
  model.next({
    ...model.getValue(),
    prices,
  })
}
