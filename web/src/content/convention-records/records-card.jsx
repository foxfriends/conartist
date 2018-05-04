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
}

type State = {
  focus: ?(Record | Expense),
}

function format(date: Date): string {
  return moment.utc(date).format(l`EEEE MMMM d, yyyy`)
}

export class RecordsCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      focus: null
    }
  }

  setFocus(focus: Record | Expense) {
    this.setState({ focus })
  }

  render() {
    const { date, convention } = this.props
    const { focus } = this.state

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
            {(item, _) =>
              item.name === 'record'
                ? <RecordItem record={item} key={`record_${item.time.getTime()}`} onClick={() => this.setFocus(item)}/>
                : <ExpenseItem expense={item} key={`expense_${item.time.getTime()}`} onClick={() => this.setFocus(item)}/>
            }
          </List>
        </BasicCard>
        { focus ? (focus.name === 'record' ? <RecordInfo record={focus} /> : <ExpenseInfo expense={focus} />) : null }
      </>
    )
  }
}
