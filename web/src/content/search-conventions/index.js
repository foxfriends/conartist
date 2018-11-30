/* @flow */
import * as React from 'react'

import { pluck, filter, tap, map } from 'rxjs/operators'

import { ConventionsConnection } from '../../api/conventions-connection'
import { ConventionCard } from '../conventions/convention-card'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { l } from '../../localization'
import { empty, extend } from '../../model/connection'
import type { Convention } from '../../model/convention'
import type { Connection } from '../../model/connection'
import S from './index.css'

export type Props = {
  name: 'search-conventions',
  search: ?string,
}

type State = {
  conventions: Connection<Convention>,
}

export class SearchConventions extends React.Component<Props, State> {
  conventionsConnection: ConventionsConnection

  constructor(props: Props) {
    super(props)

    this.state = {
      conventions: empty(),
    }

    this.conventionsConnection = new ConventionsConnection()
  }

  componentDidUpdate(prevProps) {
    if (this.props.search !== prevProps.search) {
      this.loadConventions(true)
    }
  }

  componentDidMount() {
    this.loadConventions(true)
  }

  loadConventions(fresh: boolean = false) {
    const { search } = this.props
    this.conventionsConnection.send({ search, after: fresh ? null : this.state.conventions.endCursor })
      .pipe(
        filter(({ state }) => state === 'retrieved'),
        pluck('value'),
        map(extension => fresh ? extension : extend(this.state.conventions, extension)),
      )
      .subscribe(conventions => this.setState({ conventions }))
  }

  render() {
    const { search } = this.props
    const { conventions: { nodes: conventions } } = this.state
    return (
      <CardView dataSource={conventions}>
        <Card className={S.emptyState}>
          <div className={S.placeholder}>
            {search
              ? l`<Convention search empty>`
              : l`There are no conventions right now`
            }
          </div>
        </Card>
        { convention => <ConventionCard showDetails starrable convention={convention} key={`convention_${convention.id}`}/> }
      </CardView>
    )
  }
}
