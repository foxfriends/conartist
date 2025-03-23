/*       */
import * as React from 'react'

import { TodayConventionCard } from './today-convention-card'
import { ConventionCard } from './convention-card'
import { CompletedConventionCard } from './completed-convention-card'
import { CardView } from '../card-view'
import { Card } from '../card-view/card'
import { by, Desc } from '../../util/sort'
import { l, lx } from '../../localization'
                                                        
import S from './index.css'

                     
                      
                           
 

function justDay(date      )       {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function Conventions({ conventions }       ) {
  const today = [];
  const upcoming = [];
  const completed = [];
  conventions.sort(by(['start', Desc]))
  conventions.forEach(convention => {
    const now = justDay(new Date());
    if (convention.end < now) {
      completed.push(convention)
    } else if (convention.start > now) {
      upcoming.push(convention)
    } else {
      today.push(convention)
    }
  })
  // show these ones in reverse order...
  upcoming.reverse()

  return (
    <CardView>
      { today.map(convention => <TodayConventionCard showDetails convention={convention} key={`convention_${convention.id}`}/>) }
      { today.length === 0
        ? <Card className={S.emptyState}>
            <div className={S.placeholder}>
              {l`No conventions today`}
            </div>
          </Card>
        : null
      }
      <div className={S.header}>{l`Upcoming`}</div>
      { upcoming.map(convention => <ConventionCard showDetails starrable convention={convention} key={`convention_${convention.id}`}/>) }
      { upcoming.length === 0
        ? <Card className={S.emptyState}>
            <div className={S.placeholderLarge}>
              { lx`You don't have any conventions starred... Why don't you go find one you like?`(_ => _) }
            </div>
          </Card>
        : null
      }
      <div className={S.header}>{l`Completed`}</div>
      { completed.map(convention => <CompletedConventionCard showDetails convention={convention} key={`convention_${convention.id}`}/>) }
      { completed.length === 0
        ? <Card className={S.emptyState}>
            <div className={S.placeholder}>
              { l`You haven't been to any conventions yet...` }
            </div>
          </Card>
        : null
      }
    </CardView>
  )
}
