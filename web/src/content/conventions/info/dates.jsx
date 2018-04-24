/* @flow */
import * as React from 'react'
import moment from 'moment'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { SmallCaps } from '../../../common/smallcaps'

export type Props = {
  start: Date,
  end: Date,
}

function format(date: Date): string {
  return moment(date).format(l`MMM. d, yyyy`)
}

export function DatesInfo({ start, end }: Props) {
  return <Row title={<SmallCaps>{l`Dates`}</SmallCaps>} value={l`${format(start)} - ${format(end)}`} />
}
