/* @flow */
import * as React from 'react'
import { Card } from './card'
const { Fragment } = React

import S from './index.css'

export type Props = {
  children: React.Node,
}

export function CardView({ children }: Props) {
  return (
    <div className={S.container} id='card-view'>
      { children }
    </div>
  )
}
