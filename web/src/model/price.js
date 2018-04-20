/* @flow */
import type { PriceFragmentFragment } from '../api/schema'
import { Money } from './money'

export type Price = {|
  typeId: number,
  productId: ?number,
  quantity: number,
  price: Money,
|}

export function parse({ typeId, productId, quantity, price }: PriceFragmentFragment): Price {
  return {
    typeId,
    productId,
    quantity,
    price: Money.fromJSON(price),
  }
}
