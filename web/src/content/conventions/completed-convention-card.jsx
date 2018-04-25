/* @flow */
import * as React from 'react'

import { Table } from '../../common/table'
import { Card } from '../card-view/card'
import { Icon } from '../../common/icon'
import { Font } from '../../common/font'
import { Link } from '../../common/link'
import { BasicHeader } from '../card-view/basic-header'
import { DatesInfo } from './info/dates'
import { WebsiteInfo } from './info/website'
import { NetProfit } from './info/net-profit'
import { AddressInfo } from './info/address'
import { l, lx } from '../../localization'
import * as navigate from '../../update/navigate'
import type { Convention } from '../../model/convention'

import S from './card.css'
const { Fragment } = React

export type Props = {
  convention: Convention,
}

export function CompletedConventionCard({ convention }: Props) {
  return (
    <Card>
      <BasicHeader>
        <span>
          {convention.name}
        </span>
        <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionDetails(convention)}><Font smallCaps>{l`Details`}</Font><Icon name='keyboard_arrow_right' /></Link>
      </BasicHeader>
      <Table>
        <DatesInfo start={convention.start} end={convention.end} />
        <WebsiteInfo infos={convention.extraInfo} />
        <NetProfit sales={convention.recordTotal} expenses={convention.expenseTotal} />
      </Table>
    </Card>
  )
}
