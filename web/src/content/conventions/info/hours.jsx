/* @flow */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'
import { newlinesToReact } from '../../../util/newlines-to-react'
import { sameDayAs } from '../../../util/date'
import type { ConventionExtraInfo } from '../../../model/convention-extra-info'

export type Props = {
  infos: ConventionExtraInfo[],
  todayOnly?: boolean,
}

function format(date: Date): string {
  return formatDate(date, l`h:mma`)
}

function day(date: Date): string {
  return formatDate(date, l`EEE`)
}

const isToday = sameDayAs(new Date())

export function HoursInfo({ infos, todayOnly }: Props) {
  try {
    const hoursInfo = infos.find(({ title }) => title === 'Hours')
    if (hoursInfo && hoursInfo.info) {
      const hours = JSON.parse(hoursInfo.info)
      if (todayOnly) {
        const todayHours = hours.find(([start, end]) => isToday(start))
        if (todayHours) {
          const [start, end] = todayHours
          return <Row title={<Font smallCaps>{l`Today's hours`}</Font>} value={l`${format(start)} - ${format(end)}`} />
        }
      } else {
        const hoursText = newlinesToReact(
          hours.map(([start, end]) => l`${day(start)} ${format(start)} - ${format(end)}`).join('\n')
        )
        return <Row title={<Font smallCaps>{l`Hours`}</Font>} value={hoursText} />
      }
    }
  } catch(_) {}
  return null
}
