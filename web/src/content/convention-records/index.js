/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { SecondaryCardFade as Fade } from '../../common/animation/fade/secondary-card'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { RecordsCard } from './records-card'
import { toLocal, toUTC, justDay, justUTCDay } from '../../util/date'
import type { Convention } from '../../model/convention'
import S from './records-card.css'

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
    const end = new Date(Math.min(convention.end, toUTC(justDay(new Date()))))
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
      <CardView dataSource={dates.sort().map(time => toLocal(new Date(time)))}>
        <Card className={S.emptyState}>
          <div className={S.placeholder}>
            {l`<Empty recods list message>`}
          </div>
        </Card>
        {(date, i) => <RecordsCard date={date} convention={convention} key={`records_${date.getTime()}`} onFocus={focus => this.setState({ focus })} />}
        <Fade>
          {/* $FlowIgnore */}
          { focus || null }
        </Fade>
      </CardView>
    )
  }
}
