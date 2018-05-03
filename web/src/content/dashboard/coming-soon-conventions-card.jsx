/* @flow */
import * as React from 'react'
import moment from 'moment'

import { BasicCard } from '../card-view/basic-card'
import { AutoTable as Table } from '../../common/table/auto'
import { Row } from '../../common/table/row'
import { Font } from '../../common/font'
import { Link } from '../../common/link'
import { l, lx } from '../../localization'
import * as navigate from '../../update/navigate'
import type { Convention } from '../../model/convention'
import S from './coming-soon-conventions-card.css'

export type Props = {
  conventions: Convention[],
}

function format(date: Date): string {
  return moment.utc(date).format(l`MMM. d, yyyy`)
}

export function ComingSoonConventionsCard({ conventions }: Props) {
  return (
    <BasicCard title={<Font smallCaps regular>{lx`{${conventions.length}} conventions coming soon.`(text => <Font semibold>{ text }</Font>)}</Font>}>
      <Table dataSource={conventions}>
        {({ name, start, end, id }) =>
          <Row title={name} value={l`${format(start)} - ${format(end)}`} key={`convention_${id}`} />
        }
      </Table>
      <div className={S.findMore}><Link onClick={navigate.searchConventions}>{l`Find more`}</Link></div>
    </BasicCard>
  )
}
