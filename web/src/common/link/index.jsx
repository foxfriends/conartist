/* @flow */
import * as React from 'react'

import S from './index.css'

export type Props = {
  href: string,
  className?: string,
  style?: { [string]: string | number },
  children?: React.Node,
  target?: string,
}

export function Link({ href, className, style, children, target }: Props) {
  return (
    <a href={href} className={`${S.link} ${className || ''}`} target={target} style={style}>{ children }</a>
  )
}
