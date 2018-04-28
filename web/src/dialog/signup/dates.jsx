/* @flow */
import * as React from 'react'
import moment from 'moment'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'

export type Props = {
  start: Date,
  end: Date,
}

function format(date: Date): string {
  return moment(date).format(l`MMM. d, yyyy`)
}

export function DatesInfo({ start, end }: Props) {
  return <Row title={<Font smallCaps>{l`Dates`}</Font>} value={l`${format(start)} - ${format(end)}`} />
}
