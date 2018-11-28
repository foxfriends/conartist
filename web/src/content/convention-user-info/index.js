/* @flow */
import * as React from 'react'

import { CardView } from '../card-view'
import { ConventionUserInfoCard } from './convention-user-info-card'
import { NewConventionUserInfoCard } from './new-convention-user-info-card'
import type { Convention } from '../../model/convention'

export type Props = {
  name: 'convention-user-info',
  convention: Convention,
}

export function ConventionUserInfo({ convention }: Props) {
  return (
    <CardView>
      <ConventionUserInfoCard title={convention.name} convention={convention} />
      <NewConventionUserInfoCard convention={convention} />
    </CardView>
  )
}
