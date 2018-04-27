/* @flow */
import * as React from 'react'
import { List } from './index'

type Transformer<T> = (T, number) => React.Node

export type Props<T> = {
  className?: string,
  style?: { [string]: string | number },
  children: Transformer<T> | [React.Node, Transformer<T>] | [React.Node, Transformer<T>, React.Node],
  dataSource: Iterable<T>,
}

// $FlowIgnore
export function AutoList<T>({ className, style, dataSource, children }: Props<T>) {
  const [ emptyState, transformer, footer ] = children instanceof Array
    ? [...children]
    : [, children, ]
  const data = [...dataSource]
  return (
    <List className={className} style={style}>
      { data.length === 0 ? emptyState || '' : data.map(transformer) }
      { footer || null }
    </List>
  )
}
