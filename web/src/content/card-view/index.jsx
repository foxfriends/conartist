/* @flow */
import * as React from 'react'
import { Card } from './card'
import type { Props as CardProps } from './card'
const { Fragment } = React

import S from './index.css'

type Transformer<T> = (T) => React.Node

export type Props<T> = { 
  dataSource: Iterable<T>,
  children: [React.Node, Transformer<T>] | Transformer<T>
}

export function CardView<T>({ dataSource, children }: Props<T>) {
  const [emptyState, transformer] = children instanceof Array
    ? children
    : [, children]
  const data = [...dataSource]
  if (data.length === 0) {
    return emptyState || null
  } else {
    return (
      <div className={S.container}>
        { data.map(transformer) }
      </div>
    )
  }
}
