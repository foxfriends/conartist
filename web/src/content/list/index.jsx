/* @flow */
import * as React from 'react'
import S from './index.css'

type Transformer<T> = (T) => React.Node

export type Props<T> = {
  className?: string,
  style?: { [string]: string | number },
  children: Transformer<T> | [React.Node, Transformer<T>] | [React.Node, Transformer<T>, React.Node],
  dataSource: Iterable<T>,
}

export function List<T>({ className, style, dataSource, children }: Props<T>) {
  const [ emptyState, transformer, footer ] = children instanceof Array
    ? [...children]
    : [, children, ]
  const data = [...dataSource]
  return (
    <div className={`${S.list} ${className || ''}`} style={style || {}}>
      { data.length === 0 ? emptyState || '' : data.map(transformer) }
      { footer || null }
    </div>
  )
}
