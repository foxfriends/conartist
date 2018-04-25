/* @flow */
import * as React from 'react'

import { Table } from '../../common/table'
import { Icon } from '../../common/icon'
import { Font } from '../../common/font'
import { Link } from '../../common/link'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { DatesInfo } from './info/dates'
import { HoursInfo } from './info/hours'
import { WebsiteInfo } from './info/website'
import { CurrentEarnings } from './info/current-earnings'
import { AddressInfo } from './info/address'
import { l, lx } from '../../localization'
import * as navigate from '../../update/navigate'
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
        <span>
          {lx`{${convention.name}} {is today. Good luck!}`(text => text === convention.name ? text : <Font smallCaps regular>{ text }</Font>)}
        </span>
        <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionDetails(convention)}><Font smallCaps>{l`Details`}</Font><Icon name='keyboard_arrow_right' /></Link>
      </BasicHeader>
      <Table>
        <DatesInfo start={convention.start} end={convention.end} />
        <HoursInfo todayOnly infos={convention.extraInfo} />
        <AddressInfo infos={convention.extraInfo} />
        <WebsiteInfo infos={convention.extraInfo} />
        <CurrentEarnings amount={convention.recordTotal} />
      </Table>
    </Card>
  )
}
