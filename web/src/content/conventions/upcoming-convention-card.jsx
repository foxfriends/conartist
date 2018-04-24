/* @flow */
import * as React from 'react'

import { Table } from '../../common/table'
import { IconButton } from '../../common/icon-button'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { DatesInfo } from './info/dates'
import { WebsiteInfo } from './info/website'
import { AddressInfo } from './info/address'
import { model } from '../../model'
import { l } from '../../localization'
import * as update from '../../update/conventions'
import type { Convention } from '../../model/convention'

import S from './card.css'
const { Fragment } = React

export type Props = {
  convention: Convention,
}

export function UpcomingConventionCard({ convention }: Props) {
  const selected = model.getValue().conventions.some(({ id }) => id === convention.id)

  const toggleStarred = selected
    ? () => { update.unstarConvention(convention) }
    : () => { update.starConvention(convention) }

  return (
    <Card>
      <BasicHeader>
        <IconButton
          title={selected ? 'star' : 'star_outline'}
          action={toggleStarred}
          priority='secondary'
          className={`${S.star} ${selected ? S.starSelected : ''}`}/>
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
