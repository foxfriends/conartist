/* @flow */
import * as React from 'react'
import { lx } from '../../localization'
import { SecondaryCardFade as Fade } from '../../common/animation/fade/secondary-card'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { RecordsCard } from '../convention-records/records-card'
import { toLocal, toUTC, justDay, justUTCDay } from '../../util/date'
import { model } from '../../model'
import type { Convention } from '../../model/convention'
import S from '../convention-records/records-card.css'

export type Props = {
  name: 'sales',
}

type State = {
  focus: ?React.Node
}

export class Sales extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      focus: null,
    }
  }

  render() {
    const { focus } = this.state
    const { records } = model.getValue()

    const dates = [];
    const end = new Date(toUTC(justDay(new Date())))
    // $FlowIgnore: does not understand defaulting missing args
    for (const { time } of records) {
      const day = justUTCDay(time).getTime()
      if (!dates.includes(day)) {
        dates.push(day)
      }
    }
    return (
      <CardView dataSource={dates.sort().map(time => toLocal(new Date(time)))}>
        <Card className={S.emptyState}>
          <div className={S.placeholder}>
            {lx`<Empty no-con records list message>`()}
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
