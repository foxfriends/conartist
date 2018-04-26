/* @flow */
import * as React from 'react'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'
import { Money } from '../../../model/money'

export type Props = {
  amount: ?Money,
}

export function CurrentEarnings({ amount }: Props) {
  const money = amount || Money.zero
  return money.equals(Money.zero)
    ? null
    : <Row title={<Font smallCaps>{l`Current earnings`}</Font>} value={money.toString()} />
}
