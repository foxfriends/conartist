/* @flow */
import * as React from 'react'
import { CardView } from '../card-view'
import { NewConvention } from './new-convention'

export type Props = {
  name: 'admin',
}

export function Admin(props: Props) {
  return (
    <CardView>
      <NewConvention />
    </CardView>
  )
}
