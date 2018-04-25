/* @flow */
import * as React from 'react'

import { Table } from '../../common/table'
import { Card } from '../card-view/card'
import { Font } from '../../common/font'
import { BasicHeader } from '../card-view/basic-header'
import { DatesInfo } from './info/dates'
import { WebsiteInfo } from './info/website'
import { NetProfit } from './info/net-profit'
import { AddressInfo } from './info/address'
import { lx } from '../../localization'
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
          {lx`{${convention.name}} {is today. Good luck!}`(text => text === convention.name ? text : <Font smallCaps regular>{ text }</Font>)}
        </span>
      </BasicHeader>
      <Table>
        <DatesInfo start={convention.start} end={convention.end} />
        <WebsiteInfo infos={convention.extraInfo} />
        <NetProfit sales={convention.recordTotal} expenses={convention.expenseTotal} />
      </Table>
    </Card>
  )
}
