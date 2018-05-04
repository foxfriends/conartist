/* @flow */
import * as React from 'react'
import moment from 'moment'

import { Font } from '../../common/font'
import { AutoList as List } from '../../common/list/auto'
import { RecordItem } from './record-item'
import { ExpenseItem } from './expense-item'
import { RecordInfo } from './record-info'
import { ExpenseInfo } from './expense-info'
import { Total } from './total'
import { BasicCard } from '../card-view/basic-card'
import { by, Asc } from '../../util/sort'
import { sameUTCDayAs } from '../../util/date'
import { Money } from '../../model/money'
import { l } from '../../localization'
import type { Convention } from '../../model/convention'
import S from './records-card.css'

export type Props = {
  date: Date,
  convention: Convention,
  onFocus: (?React.Node) => void,
}

function format(date: Date): string {
  return moment.utc(date).format(l`EEEE MMMM d, yyyy`)
}

export function RecordsCard({ date, convention, onFocus }: Props) {
  // $FlowIgnore: does not seem to recognize defaulting of missing properties
  const { records = [], expenses = [] } = convention

  const dataSource = []
    .concat(
      records.filter(({ time }) => sameUTCDayAs(date)(time)),
      expenses.filter(({ time }) => sameUTCDayAs(date)(time)),
    )
    .sort(by(['time', Asc]))

  const total = dataSource.reduce((acc, { name, price }) => acc.add(name === 'record' ? price : price.negate()), Money.zero)

  return (
    <>
      <BasicCard title={<Font smallCaps>{ format(date) }</Font>} collapsible footer={<Total total={total} />}>
        <List dataSource={dataSource}>
          <div className={S.placeholder}>
            {l`No activity for this day`}
          </div>
          {(item, _) => {
            // using some fake refs that are never null...
            const ref = { current: null }
            if (item.name === 'record') {
              // $FlowIgnore
              const info = <RecordInfo record={item} anchor={ref} key={`record_info_${item.id}`} onClose={() => onFocus(null)}/>
              return <RecordItem innerRef={node => node && (ref.current = node)} record={item} key={`record_${item.time.getTime()}`} onClick={() => onFocus(info)}/>
            } else {
              // $FlowIgnore
              const info = <ExpenseInfo expense={item} anchor={ref} key={`expense_info_${item.id}`} onClose={() => onFocus(null)}/>
              return <ExpenseItem innerRef={node => node && (ref.current = node)} expense={item} key={`expense_${item.time.getTime()}`} onClick={() => onFocus(info)}/>
            }
          }}
        </List>
      </BasicCard>
    </>
  )
}
