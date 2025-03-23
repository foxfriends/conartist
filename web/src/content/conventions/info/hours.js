/*       */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'
import { newlinesToReact } from '../../../util/newlines-to-react'
import { sameDayAs, dateRecovery } from '../../../util/date'
                                                                               

                     
                               
                      
 

function format(date      )         {
  return formatDate(date, l`h:mma`)
}

function day(date      )         {
  return formatDate(date, l`EEE`)
}

const isToday = sameDayAs(new Date())

export function HoursInfo({ infos, todayOnly }       ) {
  try {
    const hoursInfo = infos.find(({ title }) => title === 'Hours')
    if (hoursInfo && hoursInfo.info) {
      const hours = JSON.parse(hoursInfo.info, dateRecovery)
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
