/* @flow */
import type { PriceFragmentFragment } from '../api/schema'
import { Money } from './money'

export type Price = {|
  priceId: number,
  typeId: number,
  productId: ?number,
  quantity: number,
  price: Money,
|}

export function parse({ priceId, typeId, productId, quantity, price }: PriceFragmentFragment): Price {
  return {
    priceId,
    typeId,
    productId,
    quantity,
    price: new Money(price),
  }
}
