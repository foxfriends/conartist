/* @flow */
import * as React from 'react'

import { Font } from '../../common/font'
import { Table } from '../../common/table'
import { Link } from '../../common/link'
import { Icon } from '../../common/icon'
import { Button } from '../../common/button'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { BasicFooter } from '../card-view/basic-footer'
import { MoneyInfo } from '../conventions/info/money-info'
import { NetProfit } from '../conventions/info/net-profit'
import { l } from '../../localization'
import { Money } from '../../model/money'
import * as navigate from '../../update/navigate'
import * as dialog from '../../update/dialog'
import type { Convention } from '../../model/convention'
import S from '../conventions/card.css'
import SS from './card.css'

export type Props = {
  convention: Convention,
}

export function ConventionRevenueCard({ convention }: Props) {
  return (
    <Card>
      <BasicHeader>
        <Font smallCaps>{l`Revenue`}</Font>
        <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionRecords(convention)}><Font smallCaps>{l`Details`}</Font><Icon name='keyboard_arrow_right' /></Link>
      </BasicHeader>
      <Table>
        <MoneyInfo title={l`Total sales`} amount={convention.recordTotal} />
        <MoneyInfo title={l`Total expenses`} amount={convention.expenseTotal} />
        <NetProfit sales={convention.recordTotal} expenses={convention.expenseTotal} />
      </Table>
      <BasicFooter className={SS.footer}>
        <Button priority='primary' className={SS.button} onClick={dialog.showNewSaleDialog}>{l`New sale`}</Button>
        <Button priority='secondary' className={SS.button} onClick={dialog.showNewExpenseDialog}>{l`New expense`}</Button>
      </BasicFooter>
    </Card>
  )
}
