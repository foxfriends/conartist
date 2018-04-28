/* @flow */
import type { ExpenseFragmentFragment } from '../api/schema'
import { Money } from './money'

export type Expense = {|
  name: 'expense',
  id: number,
  category: string,
  description: string,
  price: Money,
  time: Date,
|}

export function parse({ id, category, description, price, time }: ExpenseFragmentFragment): Expense {
  return {
    name: 'expense',
    id,
    category,
    description,
    price: Money.fromJSON(price),
    time: new Date(time),
  }
}
