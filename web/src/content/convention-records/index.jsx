/* @flow */
import * as React from 'react'
import { AutoCardView as CardView } from '../card-view/auto'
import { RecordsCard } from './records-card'
import type { Convention } from '../../model/convention'

export type Props = {
  name: 'convention-records',
  convention: Convention,
}

export function ConventionRecords({ convention }: Props) {
  const dates = [];
  for (const date = new Date(convention.start); date < convention.end; date.setDate(date.getDate() + 1)) {
    dates.push(new Date(date))
  }
  return (
    <CardView dataSource={dates}>
      {date => <RecordsCard date={date} convention={convention} key={`records_${date.getTime()}`} />}
    </CardView>
  )
}
