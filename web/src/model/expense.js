/* @flow */
import type { Money } from './money'
export type Expense = {
  id: number,
  category: string,
  description: string,
  price: Money,
  time: Date,
}
