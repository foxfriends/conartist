/* @flow */
import { Money } from './money'
export type Record = {|
  id: number,
  products: number[],
  price: Money,
  time: Date,
  info: string,
|}
