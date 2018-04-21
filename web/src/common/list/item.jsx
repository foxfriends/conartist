/* @flow */
import * as React from 'react'
import S from './item.css'

export type Props = {
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
}

export function Item({ className, style, children }: Props) {
  return (
    <div className={`${S.item} ${className || ''}`} style={style || {}}>
      { children }
    </div>
  )
}
