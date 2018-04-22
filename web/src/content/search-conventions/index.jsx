/* @flow */
import * as React from 'react'

import { pluck, filter, tap } from 'rxjs/operators'

import { ConventionsConnection } from '../../api/conventions-connection'
import { UpcomingConventionCard } from '../conventions/upcoming-convention-card'
import { CardView } from '../card-view'
import type { Convention } from '../../model/convention'
import type { Connection } from '../../model/connection'
import S from './index.css'

export type Props = {
  name: 'search-conventions',
}

type State = {
  conventions: Connection<Convention>,
}

export class SearchConventions extends React.Component<Props, State> {
  conventionsConnection: ConventionsConnection

  constructor(props: Props) {
    super(props)

    this.state = {
      conventions: {
        nodes: [],
        endCursor: null,
        totalNodes: 0,
      },
    }

    this.conventionsConnection = new ConventionsConnection()
  }

  componentDidMount() {
    this.conventionsConnection.send()
      .pipe(
        filter(({ state }) => state === 'retrieved'),
        tap(console.log),
        pluck('value'),
      )
      .subscribe(conventions => this.setState({ conventions }))
  }

  render() {
    const { conventions: { nodes: conventions } } = this.state
    return (
      <CardView>
        { conventions.map(convention => <UpcomingConventionCard convention={convention} key={`convention_${convention.id}`}/>) }
      </CardView>
    )
  }
}
