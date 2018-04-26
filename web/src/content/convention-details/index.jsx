/* @flow */
import * as React from 'react'

import { CardView } from '../card-view'
import { ConventionCard } from '../conventions/convention-card'
import { ConventionUserInfoCard } from '../convention-user-info/convention-user-info-card'
import type { Convention } from '../../model/convention'
import S from './index.css'

export type Props = {
  name: 'convention-details',
  convention: Convention,
}

export function ConventionDetails({ convention }: Props) {
  return (
    <CardView>
      <ConventionCard includeHours convention={convention} />
      <ConventionUserInfoCard hasSeeAllButton convention={convention} limit={5} />
    </CardView>
  )
}
