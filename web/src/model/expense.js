/* @flow */
import type { ExpenseFragmentFragment } from '../api/schema'
import { Money } from './money'

export type Expense = {|
  id: number,
  category: string,
  description: string,
  price: Money,
  time: Date,
|}

export function parse({ id, category, description, price, time }: ExpenseFragmentFragment): Expense {
  return {
    id,
    category,
    description,
    price: Money.fromJSON(price),
    time: new Date(time),
  }
}
