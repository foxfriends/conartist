/* @flow */
import * as React from 'react'

import { pluck, filter, tap } from 'rxjs/operators'

import { ConventionsConnection } from '../../api/conventions-connection'
import { ConventionCard } from '../conventions/convention-card'
import { CardView } from '../card-view'
import { Card } from '../card-view/card'
import { l } from '../../localization'
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
        pluck('value'),
      )
      .subscribe(conventions => this.setState({ conventions }))
  }

  render() {
    const { conventions: { nodes: conventions } } = this.state
    return (
      <CardView>
        { conventions.length
          ? conventions.map(convention => <ConventionCard showDetails starrable convention={convention} key={`convention_${convention.id}`}/>)
          : <Card className={S.emptyState}>
              <div className={S.placeholder}>
                {l`Loading...`}
              </div>
            </Card>
        }
      </CardView>
    )
  }
}