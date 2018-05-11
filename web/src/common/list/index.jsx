/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props<T> = {
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
  reorderable?: bool | (T, number) => void,
}

export function List<T>({ className, style, children, reorderable }: Props<T>) {
  return (
    <div className={`${S.list} ${className || ''}`} style={style || {}}>
      { children }
    </div>
  )
}
