/* @flow */
import * as React from 'react'
import { AutoCardView as CardView } from '../card-view/auto'
import { RecordsCard } from './records-card'
import { justDay } from '../../util/date'
import type { Convention } from '../../model/convention'

export type Props = {
  name: 'convention-records',
  convention: Convention,
}

export function ConventionRecords({ convention }: Props) {
  const dates = [];
  const end = new Date(Math.min(convention.end, justDay(new Date())))
  for (const date = new Date(justDay(convention.start)); date <= end; date.setDate(date.getDate() + 1)) {
    dates.push(new Date(date).getTime())
  }
  for (const item of [].concat(convention.records || [], convention.expenses || [])) {
    const day = justDay(item.time).getTime()
    if (!dates.includes(day)) {
      dates.push(day)
    }
  }
  console.log(dates)
  return (
    <CardView dataSource={dates.sort().map(time => new Date(time))}>
      {date => <RecordsCard date={date} convention={convention} key={`records_${date.getTime()}`} />}
    </CardView>
  )
}
