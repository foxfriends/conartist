/* @flow */
import * as React from 'react'
import { AutoCardView as CardView } from '../card-view/auto'
import { RecordsCard } from './records-card'
import { justUTCDay } from '../../util/date'
import type { Convention } from '../../model/convention'

export type Props = {
  name: 'convention-records',
  convention: Convention,
}

type State = {
  focus: ?React.Node
}

export class ConventionRecords extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      focus: null,
    }
  }

  render() {
    const { convention } = this.props
    const { focus } = this.state

    const dates = [];
    const end = new Date(Math.min(convention.end, justUTCDay(new Date())))
    for (const date = new Date(justUTCDay(convention.start)); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date).getTime())
    }
    // $FlowIgnore: does not understand defaulting missing args
    for (const item of [].concat(convention.records || [], convention.expenses || [])) {
      const day = justUTCDay(item.time).getTime()
      if (!dates.includes(day)) {
        dates.push(day)
      }
    }
    return (
      <CardView dataSource={dates.sort().map(time => new Date(time))}>
        <></>
        {date => <RecordsCard date={date} convention={convention} key={`records_${date.getTime()}`} onFocus={focus => this.setState({ focus })} />}
        { focus || null }
      </CardView>
    )
  }
}
