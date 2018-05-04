/* @flow */
import * as React from 'react'

import { TodayConventionCard } from './today-convention-card'
import { ConventionCard } from './convention-card'
import { CompletedConventionCard } from './completed-convention-card'
import { CardView } from '../card-view'
import { Card } from '../card-view/card'
import { l, lx } from '../../localization'
import type { Convention } from '../../model/convention'
import S from './index.css'

export type Props = {
  name: 'conventions',
  conventions: Convention[]
}

function justDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function Conventions({ conventions }: Props) {
  const today = [];
  const upcoming = [];
  const completed = [];

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
