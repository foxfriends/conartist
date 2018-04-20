/* @flow */
import type { RecordFragmentFragment } from '../api/schema'
import { Money } from './money'

export type Record = {|
  id: number,
  products: number[],
  price: Money,
  time: Date,
  info: string,
|}

export function parse({ id, products, price, time, info }: RecordFragmentFragment): Record {
  return {
    id,
    products,
    price: Money.fromJSON(price),
    time: new Date(time),
    info,
  }
}
