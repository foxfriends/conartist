/* @flow */
import * as React from 'react'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'
import { Money } from '../../../model/money'

export type Props = {
  sales: ?Money,
  expenses: ?Money,
}

export function NetProfit({ sales, expenses }: Props) {
  sales = sales || Money.zero
  expenses = expenses || Money.zero
  const net = sales.add(expenses.negate())
  return <Row title={<Font smallCaps>{l`Net profit`}</Font>} value={net.toString()} />
}
