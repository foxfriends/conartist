/* @flow */
import type { ExpenseFragment } from '../api/schema'
import { Money } from './money'

export type Expense = {|
  name: 'expense',
  id: number,
  uuid: ?string,
  category: string,
  description: string,
  price: Money,
  time: Date,
|}

export function parse({ id, uuid, category, description, price, time }: ExpenseFragment): Expense {
  return {
    name: 'expense',
    id,
    uuid,
    category,
    description,
    price: Money.fromJSON(price),
    time: new Date(time),
  }
}
