/* @flow */
import * as React from 'react'
import S from './index.css'
import { Item } from './item'

export type Props<T> = {
  dataSource: Iterable<T>,
  children: (T) => React.Node,
}

export function List<T>({ dataSource, children }: Props<T>) {
  return (
    <div className={S.list}>
      { [...dataSource].map(children) }
    </div>
  )
}
