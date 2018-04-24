/* @flow */
import * as React from 'react'

import { UpcomingConventionCard } from '../conventions/upcoming-convention-card'
import { CardView } from '../card-view'
import type { Convention } from '../../model/convention'
import S from './index.css'

export type Props = {
  name: 'convention-details',
  convention: Convention,
}

export function ConventionDetails({ convention }: Props) {
  return (
    <CardView>
      Hello
    </CardView>
  )
}
