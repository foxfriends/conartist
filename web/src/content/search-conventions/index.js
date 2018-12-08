/* @flow */
import * as React from 'react'

import { pluck, filter, tap, map } from 'rxjs/operators'

import { ConventionsConnection } from '../../api/conventions-connection'
import { ConventionCard } from '../conventions/convention-card'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { l } from '../../localization'
import { empty, extend, isFull, isEmpty } from '../../model/connection'
import type { Convention } from '../../model/convention'
import type { Connection } from '../../model/connection'
import S from './index.css'

export type Props = {
  name: 'search-conventions',
  search: ?string,
}

type State = {
  conventions: Connection<Convention>,
  loading: boolean,
}

export class SearchConventions extends React.Component<Props, State> {
  conventionsConnection: ConventionsConnection

  constructor(props: Props) {
    super(props)

    this.state = {
      conventions: empty(),
      loading: false,
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
    const { conventions } = this.state
    if (fresh || !isFull(conventions)) {
      this.setState({ loading: true })
      this.conventionsConnection.send({ search, after: fresh ? null : conventions.endCursor })
        .pipe(
          filter(({ state }) => state === 'retrieved'),
          pluck('value'),
          map(extension => fresh ? extension : extend(conventions, extension)),
        )
        .subscribe(conventions => this.setState({ conventions, loading: false }))
    }
  }

  render() {
    const { search } = this.props
    const { conventions, loading } = this.state
    return (
      <CardView dataSource={conventions.nodes} loadMore={(!loading && !isFull(conventions) && !isEmpty(conventions)) ? (() => this.loadConventions()) : null}>
        <Card className={S.emptyState}>
          <div className={S.placeholder}>
            {search
              ? l`<Convention search empty>`
              : l`There are no conventions right now`
            }
          </div>
        </Card>
        { convention => <ConventionCard showDetails starrable convention={convention} key={`convention_${convention.id}`}/> }
        { loading ? <Card className={S.loadMore}>{l`Loading...`}</Card> : null }
      </CardView>
    )
  }
}
