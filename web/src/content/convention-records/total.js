/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import type { Money } from '../../model/money'
import S from './item.css'

export type Props = {
  total: Money,
}

export function Total({ total }: Props) {
  return (
    <div className={S.item}>
      <span className={S.title}>{l`Total`}</span><span className={S.amount}>{total.toString()}</span>
    </div>
  )
}
