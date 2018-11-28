/* @flow */
import * as React from 'react'

import S from './index.css'

export type Props = {
  href?: string,
  onClick?: () => void,
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
  target?: string,
}

export function Link({ href, onClick, className, style, children, target }: Props) {
  return href
    ? <a href={href} className={`${S.link} ${className || ''}`} target={target} style={style}>{children}</a>
    : <a onClick={onClick} className={`${S.link} ${className || ''}`} style={style}>{children}</a>
}
