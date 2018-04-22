/* @flow */
import * as React from 'react'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import type { Convention } from '../../model/convention'

export type Props = {
  convention: Convention,
}

export function UpcomingConventionCard({ convention }: Props) {
  return (
    <Card>
      <BasicHeader title={convention.name} />
      <div />
    </Card>
  )
}
