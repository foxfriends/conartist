/* @flow */
import * as React from 'react'
import { Table } from './index'

type Transformer<T> = (T, number) => React.Node

export type Props<T> = {
  dataSource: Iterable<T>,
  children: Transformer<T> | [React.Node, Transformer<T>] | [React.Node, Transformer<T>, React.Node],
}

export function AutoTable<T>({ dataSource, children }: Props<T>) {
  const [emptyState, transformer, footer] = children instanceof Array
    ? [...children]
    : [, children, ]

  const data = [...dataSource]
  return (
    <>
      { data.length === 0 ? emptyState || null : null}
      <Table>
        { data.map(transformer) }
      </Table>
      { footer || null }
    </>
  )
}
