/* @flow */
import * as React from 'react'
import S from './index.css'

type Transformer<T> = (T) => React.Node

export type Props<T> = {
  dataSource: Iterable<T>,
  children: Transformer<T> | [React.Node, Transformer<T>] | [React.Node, Transformer<T>, React.Node],
}

export function Table<T>({ dataSource, children }: Props<T>) {
  const [emptyState, transformer, footer] = children instanceof Array 
    ? [...children]
    : [, children, ]

  const data = [...dataSource]
  return (
    <div className={S.list}>
      { data.length === 0 ? emptyState || null : data.map(transformer) }
      { footer || null }
    </div>
  )
}
