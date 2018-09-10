/* @flow */
import * as React from 'react'
import moment from 'moment'

import { Font } from '../../common/font'
import { Table } from '../../common/table'
import { Link } from '../../common/link'
import { Icon } from '../../common/icon'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { MoneyInfo } from '../conventions/info/money-info'
import { l } from '../../localization'
import { Money } from '../../model/money'
import * as navigate from '../../update/navigate'
import type { Convention } from '../../model/convention'
import S from './card.css'

export type Props = {
  convention: Convention,
}

export function ConventionStatsCard({ convention }: Props) {
  // $FlowIgnore: not catching defaulting of missing props
  if ((convention.records || []).length === 0) { return null }

  const totalProfit = convention.recordTotal.add(convention.expenseTotal.negate())
  const hours = convention.extraInfo.find(({ title }) => title === 'Hours')
  let profitPerHour = 0
  if (hours) {
    const totalHours = JSON.parse(hours.info)
      .map(([start, end]) => moment.duration(moment(end).diff(moment(start))).asHours())
      .reduce((hours, day) => hours + day, 0)
    if (totalHours !== 0) {
      profitPerHour = totalProfit.multiply(1 / totalHours)
    }
  }

  return (
    <Card>
      <BasicHeader>
        <Font smallCaps>{l`Stats`}</Font>
        <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionStats(convention)}><Font smallCaps>{l`See all`}</Font><Icon name='keyboard_arrow_right' /></Link>
      </BasicHeader>
      <Table>
        { profitPerHour ? <MoneyInfo title={l`Profit per hour`} amount={profitPerHour} /> : null }
      </Table>
    </Card>
  )
}
