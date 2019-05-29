/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import type { Money } from '../../model/money'
import S from './total-footer.css'

export type Props = {
  total: Money,
  sales: Money,
  expenses: Money,
}

export function TotalFooter({ total, sales, expense }: Props) {
  return (
    <div className={S.footer}>
      <div className={S.item}>
        <span className={S.title}>{l`Sales`}</span><span className={S.amount}>{sales.toString()}</span>
      </div>
      <div className={S.item}>
        <span className={S.title}>{l`Expenses`}</span><span className={S.amount}>{expense.toString()}</span>
      </div>
      <div className={S.item}>
        <span className={S.title}>{l`Total`}</span><span className={S.amount}>{total.toString()}</span>
      </div>
    </div>
  )
}
