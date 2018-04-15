/* @flow */
import * as React from 'react'
import S from './index.css'
import { Item } from './item'

type Transformer<T> = (T) => React.Node

export type Props<T> = {
  dataSource: Iterable<T>,
  children: [React.Node, Transformer<T>] | Transformer<T>
}

export function List<T>({ dataSource, children }: Props<T>) {
  const [emptyState, transformer] = children instanceof Array 
    ? children
    : [, children]

  const data = [...dataSource]
  if (data.length === 0) {
    return emptyState || null
  } else {
    return (
      <div className={S.list}>
        { data.map(transformer) }
      </div>
    )
  }
}
