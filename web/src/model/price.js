/* @flow */
import { Money } from './money'
export type Price = {|
  priceId: number,
  typeId: number,
  productId: ?number,
  quantity: number,
  price: Money,
|}
