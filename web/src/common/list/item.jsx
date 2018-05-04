/* @flow */
import * as React from 'react'
import S from './item.css'

export type Props = {
  className?: string,
  onClick?: () => void,
  style?: { [string]: string | number },
  children?: React.Node,
}

export function Item({ className, onClick, style, children }: Props) {
  return (
    <div className={`${S.item} ${onClick ? S.clickable : ''} ${className || ''}`} style={style || {}} onClick={onClick}>
      { children }
    </div>
  )
}
