/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { CardView } from './index'
import { Card } from './card'
const { Fragment } = React

import S from './index.css'

type Transformer<T> = (T, number) => React.Node

export type Props<T> = {
  dataSource: Iterable<T>,
  loadMore?: ?(() => void),
  children: Transformer<T> | [React.Node, Transformer<T>] | [React.Node, Transformer<T>, React.Node]
}

export function AutoCardView<T>({ dataSource, loadMore, children }: Props<T>) {
  const [emptyState, transformer, footer] = children instanceof Array
    ? [...children]
    : [, children, ]
  const data = [...dataSource]
  return (
    <CardView>
      { data.length === 0 ? emptyState || null : data.map(transformer) }
      { loadMore ? <Card className={S.loadMore} onClick={loadMore}>{l`Load more`}</Card> : null }
      { footer || null }
    </CardView>
  )
}
