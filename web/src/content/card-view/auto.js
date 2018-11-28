/* @flow */
import * as React from 'react'
import { CardView } from './index'
const { Fragment } = React

import S from './index.css'

type Transformer<T> = (T, number) => React.Node

export type Props<T> = {
  dataSource: Iterable<T>,
  children: Transformer<T> | [React.Node, Transformer<T>] | [React.Node, Transformer<T>, React.Node]
}

export function AutoCardView<T>({ dataSource, children }: Props<T>) {
  const [emptyState, transformer, footer] = children instanceof Array
    ? [...children]
    : [, children, ]
  const data = [...dataSource]
  return (
    <CardView>
      { data.length === 0 ? emptyState || null : data.map(transformer) }
      { footer || null }
    </CardView>
  )
}
