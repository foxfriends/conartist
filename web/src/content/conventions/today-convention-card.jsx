/* @flow */
import * as React from 'react'

import { Table } from '../../common/table'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { DatesInfo } from './info/dates'
import { WebsiteInfo } from './info/website'
import { AddressInfo } from './info/address'
import { l } from '../../localization'
import type { Convention } from '../../model/convention'

import S from './card.css'
const { Fragment } = React

export type Props = {
  convention: Convention,
}

export function TodayConventionCard({ convention }: Props) {
  return (
    <Card>
      <BasicHeader>
        {convention.name}
      </BasicHeader>
      <Table>
        <DatesInfo start={convention.start} end={convention.end} />
        <AddressInfo infos={convention.extraInfo} />
        <WebsiteInfo infos={convention.extraInfo} />
      </Table>
    </Card>
  )
}
