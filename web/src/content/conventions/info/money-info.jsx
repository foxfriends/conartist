/* @flow */
import * as React from 'react'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'
import { Money } from '../../../model/money'

export type Props = {
  hideZero?: boolean,
  title: string,
  amount: ?Money,
}

export function MoneyInfo({ hideZero, title, amount }: Props) {
  const money = amount || Money.zero
  return money.equals(Money.zero) && hideZero
    ? null
    : <Row title={<Font smallCaps>{title}</Font>} detail={money.toString()} />
}
