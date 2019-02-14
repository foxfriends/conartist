/* @flow */
import * as React from 'react'
import formatDate from 'date-fns/format'
import addMinutes from 'date-fns/addMinutes'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'

export type Props = {
  start: Date,
  end: Date,
}

function format(date: Date): string {
  return formatDate(date, l`MMM. d, yyyy`)
}

export function DatesInfo({ start, end }: Props) {
  const utcStart = addMinutes(start, start.getTimezoneOffset())
  const utcEnd = addMinutes(end, end.getTimezoneOffset())
  return <Row title={<Font smallCaps>{l`Dates`}</Font>} value={l`${format(utcStart)} - ${format(utcEnd)}`} />
}
