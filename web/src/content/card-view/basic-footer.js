/* @flow */
import * as React from 'react'
import S from './basic-footer.css'

export type Props = {
  children: React.Node,
  className?: ?string
}

export function BasicFooter({ children, className }: Props) {
  return children ? <div className={`${S.footer} ${className || ''}`}>{ children }</div> : null
}
