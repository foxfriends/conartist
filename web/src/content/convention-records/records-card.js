/* @flow */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { Font } from '../../common/font'
import { AutoList as List } from '../../common/list/auto'
import { RecordItem } from './record-item'
import { ExpenseItem } from './expense-item'
import { RecordInfo } from './record-info'
import { ExpenseInfo } from './expense-info'
import { TotalFooter } from './total-footer'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { by, Asc } from '../../util/sort'
import { sameDayAs } from '../../util/date'
import { Money } from '../../model/money'
import { l } from '../../localization'
import type { Convention } from '../../model/convention'
import type { Record } from '../../model/record'
import S from './records-card.css'

export type Props = {
  date: Date,
  records?: ?Record[],
  convention?: ?Convention,
  onFocus: (?React.Node) => void,
}

function format(date: Date): string {
  return formatDate(date, l`EEEE MMMM d, yyyy`)
}

export function RecordsCard({ date, records: propsRecords, convention, onFocus }: Props) {
  // $FlowIgnore: does not seem to recognize defaulting of missing properties
  const { records = propsRecords || [], expenses = [] } = convention || {}

  const dataSource = []
    .concat(
      records.filter(({ time }) => sameDayAs(date)(time)),
      expenses.filter(({ time }) => sameDayAs(date)(time)),
    )
    .sort(by(['time', Asc]))

  const sales = dataSource.reduce((acc, { name, price }) => acc.add(name === 'record' ? price : Money.zero), Money.zero)
  const expense = dataSource.reduce((acc, { name, price }) => acc.add(name === 'record' ? Money.zero : price), Money.zero)
  const total = sales.add(expense.negate())

  return (
    <>
      <Card collapsible={() => onFocus(null)}>
        <BasicHeader><Font smallCaps>{ format(date) }</Font></BasicHeader>
        <>
          <List dataSource={dataSource}>
            <div className={S.placeholder}>
              {l`No activity for this day`}
            </div>
            {(item, _) => {
              // using some fake refs that are never null...
              const ref = { current: null }
              if (item.name === 'record') {
                // $FlowIgnore
                const info = <RecordInfo
                  convention={convention}
                  record={item}
                  anchor={ref}
                  key={`record_info_${item.id}`}
                  onClose={() => onFocus(null)} />
                return <RecordItem
                  innerRef={node => node && (ref.current = node)}
                  record={item}
                  key={`record_${item.time.getTime()}`}
                  onClick={() => onFocus(info)} />
              } else {
                // $FlowIgnore
                const info = <ExpenseInfo
                  expense={item}
                  anchor={ref}
                  key={`expense_info_${item.id}`}
                  onClose={() => onFocus(null)} />
                return <ExpenseItem
                  innerRef={node => node && (ref.current = node)}
                  expense={item}
                  key={`expense_${item.time.getTime()}`}
                  onClick={() => onFocus(info)} />
              }
            }}
          </List>
        </>
        <TotalFooter total={total} sales={sales} expense={expense} />
      </Card>
    </>
  )
}
