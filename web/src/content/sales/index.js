/* @flow */
import * as React from 'react'
import { l, lx } from '../../localization'
import { SecondaryCardFade as Fade } from '../../common/animation/fade/secondary-card'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { RecordsCard } from '../convention-records/records-card'
import { toLocal, justDay } from '../../util/date'
import { model } from '../../model'
import * as update from '../../update/sales'
import type { Convention } from '../../model/convention'
import S from '../convention-records/records-card.css'

export type Props = {
  name: 'sales',
}

type State = {
  loaded: boolean,
  focus: ?React.Node
}

export class Sales extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loaded: false,
      focus: null,
    }
  }

  async componentDidMount() {
    try {
      await update.loadSales(true)
    } finally {
      this.setState({ loaded: true })
    }
  }

  render() {
    const { focus, loaded } = this.state
    const { records: { nodes: records, endCursor } } = model.getValue()

    const dates = [];
    // $FlowIgnore: does not understand defaulting missing args
    for (const { time } of records) {
      const day = justDay(time).getTime()
      if (!dates.includes(day)) {
        dates.push(day)
      }
    }
    return (
      <CardView dataSource={dates.sort().map(time => toLocal(new Date(time)))}>
        <Card className={S.emptyState}>
          <div className={S.placeholder}>
            {loaded ? lx`<Empty no-con records list message>`() : l`Loading...`}
          </div>
        </Card>
        {(date, i) => <RecordsCard records={records} date={date} key={`records_${date.getTime()}`} onFocus={focus => this.setState({ focus })} />}
        <Fade>
          {/* $FlowIgnore */}
          { focus || null }
        </Fade>
      </CardView>
    )
  }
}
