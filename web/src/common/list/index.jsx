/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props = {
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
}

export function List({ className, style, children }: Props) {
  return (
    <div className={`${S.list} ${className || ''}`} style={style || {}}>
      { children }
    </div>
  )
}
