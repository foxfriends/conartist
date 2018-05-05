/* @flow */
import * as React from 'react'
import moment from 'moment'

import { List } from '../../common/list'
import { Font } from '../../common/font'
import { Item } from '../../common/list/item'
import { l } from '../../localization'
import { SecondaryCard } from '../card-view/secondary-card'
import type { Expense } from '../../model/expense'
import S from './info.css'

export type Props = {
  expense: Expense,
  // $FlowIgnore
  anchor: React.Ref<HTMLElement>,
  onClose: () => void,
}

function format(date: Date): string {
  return moment(date).format(l`h:mma`)
}

export function ExpenseInfo({ expense, anchor, onClose }: Props) {
  return (
    <SecondaryCard title={l`Expense`} anchor={anchor} onClose={onClose}>
      <List>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Category`}</Font>
          <span>{ expense.category }</span>
        </Item>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Price`}</Font>
          { expense.price.toString() }
        </Item>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Time`}</Font>
          { format(expense.time) }
        </Item>
      </List>
      <div className={S.info}>
        <Font smallCaps semibold>{l`Note`}</Font>
        <div className={S.rule}/>
      </div>
      <div className={S.note}>{ expense.description || <span className={S.placeholder}>{l`Nothing to say...`}</span> }</div>
    </SecondaryCard>
  )
}
