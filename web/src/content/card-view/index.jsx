/* @flow */
import * as React from 'react'
import { Card } from './card'
import type { Props as CardProps } from './card'
const { Fragment } = React

import S from './index.css'

export type Props<T> = { 
  dataSource: Iterable<T>,
  children: (T) => React.Node,
}

export function CardView<T>({ dataSource, children }: Props<T>) {
  return (
    <div className={S.container}>
      { [...dataSource].map(children) }
    </div>
  )
}
