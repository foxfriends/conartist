/* @flow */
import type { RecordFragment } from '../api/schema'
import { Money } from './money'

export type Record = {|
  name: 'record',
  id: number,
  uuid: ?string,
  products: number[],
  price: Money,
  time: Date,
  info: string,
|}

export function parse({ id, uuid, products, price, time, info }: RecordFragment): Record {
  return {
    name: 'record',
    id,
    uuid,
    products,
    price: Money.fromJSON(price),
    time: new Date(time),
    info,
  }
}
