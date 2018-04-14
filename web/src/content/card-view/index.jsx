/* @flow */
import * as React from 'react'
import { Card } from './card'
import type { Props as CardProps } from './card'
const { Fragment } = React

export type Props<T> = { 
  dataSource: Iterable<T>,
  children: (T) => React.Node,
}

export function CardView<T>({ dataSource, children }: Props<T>) {
  return (
    <Fragment>
      { [...dataSource].map(children) }
    </Fragment>
  )
}
