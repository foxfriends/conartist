/* @flow */
import * as React from 'react'

import { Font } from '../../common/font'
import { Table } from '../../common/table'
import { Link } from '../../common/link'
import { Icon } from '../../common/icon'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { MoneyInfo } from '../conventions/info/money-info'
import { NetProfit } from '../conventions/info/net-profit'
import { l } from '../../localization'
import * as navigate from '../../update/navigate'
import type { Convention } from '../../model/convention'
import S from '../conventions/card.css'

export type Props = {
  convention: Convention,
}

export function ConventionRevenueCard({ convention }: Props) {
  if (convention.recordTotal === 0 && convention.expenseTotal === 0 && convention.start > new Date()) { return null }
  return (
    <Card>
      <BasicHeader>
        <span>
          <Font smallCaps>{l`Revenue`}</Font>
        </span>
        <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionRecords(convention)}><Font smallCaps>{l`Details`}</Font><Icon name='keyboard_arrow_right' /></Link>
      </BasicHeader>
      <Table>
        <MoneyInfo title={l`Total sales`} amount={convention.recordTotal} />
        <MoneyInfo title={l`Total expenses`} amount={convention.expenseTotal} />
        <NetProfit sales={convention.recordTotal} expenses={convention.expenseTotal} />
      </Table>
    </Card>
  )
}
