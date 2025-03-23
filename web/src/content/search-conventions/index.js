/*       */
import * as React from 'react'
import { pluck, filter, tap, map } from 'rxjs/operators'

import { ConventionsConnection } from '../../api/conventions-connection'
import { ConventionCard } from '../conventions/convention-card'
import { Input } from '../../common/input'
import { AutoCardView as CardView } from '../card-view/auto'
import { Card } from '../card-view/card'
import { SecondaryCard } from '../card-view/secondary-card'
import { SecondaryCardFade as Fade } from '../../common/animation/fade/secondary-card'
import { l } from '../../localization'
import { throttle } from '../../util/timing'
import { empty, extend, isFull, isEmpty } from '../../model/connection'
                                                        
                                                        
import S from './index.css'

const { Fragment } = React

                     
                             
                  
                    
 

              
                                      
                   
               
                  
 

export class SearchConventions extends React.Component               {
  conventionsConnection                       

  constructor(props       ) {
    super(props)

    this.state = {
      conventions: empty(),
      loading: false,
      city: '',
      country: '',
    }

    this.conventionsConnection = new ConventionsConnection()

    this.advancedSearch = null

    this.reloadConventions = throttle(250)(() => this.loadConventions(true))
  }

  componentDidUpdate(prevProps) {
    if (this.props.search !== prevProps.search) {
      this.reloadConventions()
    }
  }

  componentDidMount() {
    this.loadConventions(true)
  }

  loadConventions(fresh          = false) {
    const { search } = this.props
    const { conventions, city, country } = this.state
    if (fresh || !isFull(conventions)) {
      const query = `${search}${city && `{city:${city}}`}${country && `{country:${country}}`}`
      this.setState({ loading: true })
      this.conventionsConnection.send({ search: query, after: fresh ? null : conventions.endCursor })
        .pipe(
          filter(({ state }) => state === 'retrieved'),
          pluck('value'),
          map(extension => fresh ? extension : extend(conventions, extension)),
        )
        .subscribe(conventions => this.setState({ conventions, loading: false }))
    }
  }

  render() {
    const { search, advanced } = this.props
    const { conventions, loading, city, country } = this.state

    if (advanced && !this.advancedSearch) {
      this.advancedSearch = (
        <SecondaryCard title={l`Advanced Search`}>
          <Input
            title={l`Country`}
            defaultValue={country}
            className={S.filterInput}
            onChange={country => this.setState({ country }, this.reloadConventions)}
          />
          <Input
            title={l`City`}
            defaultValue={city}
            className={S.filterInput}
            onChange={city => this.setState({ city }, this.reloadConventions)}
          />
        </SecondaryCard>
      )
    } else if (!advanced) {
      this.advancedSearch = null
    }

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
        <Fragment>
          { loading ? <Card className={S.loadMore}>{l`Loading...`}</Card> : null }
          <Fade>
            { this.advancedSearch }
          </Fade>
        </Fragment>
      </CardView>
    )
  }
}
