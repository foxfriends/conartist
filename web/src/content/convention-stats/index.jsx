/* @flow */
import * as React from 'react'
import { SecondaryCardFade as Fade } from '../../common/animation/fade/secondary-card'
import { CardView } from '../card-view'
import type { Convention } from '../../model/convention'

export type Props = {
  name: 'convention-stats',
  convention: Convention,
}

type State = {
  settings: ?React.Node
}

export class ConventionStats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      settings: null,
    }
  }

  render() {
    const { convention } = this.props
    const { settings } = this.state

    return (
      <CardView>
        <Fade>
          {/* $FlowIgnore */}
          { settings || null }
        </Fade>
      </CardView>
    )
  }
}
