/* @flow */

export type NewExpense = { name: 'new-expense' }

export const newExpense: (?Expense) => NewExpense = expense => ({
  name: 'new-expense',
  expense,
})
