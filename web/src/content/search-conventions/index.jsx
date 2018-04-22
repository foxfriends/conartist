/* @flow */
import * as React from 'react'

import { UpcomingConventionCard } from '../conventions/upcoming-convention-card'
import { CardView } from '../card-view'
import type { Convention } from '../../model/convention'
import S from './index.css'

export type Props = {
  name: 'search-conventions',
}

type State = {
  conventions: Convention[]
}

export class SearchConventions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      conventions: [],
    }
  }

  render() {
    const { conventions } = this.state
    return (
      <CardView>
        { conventions.map(convention => <UpcomingConventionCard convention={convention} key={`convention_${convention.id}`}/>) }
      </CardView>
    )
  }
}
