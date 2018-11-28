/* @flow */
import * as React from 'react'
import S from './basic-footer.css'

export type Props = {
  children: React.Node,
}

export function BasicFooter({ children }: Props) {
  return children ? <div className={S.footer}>{ children }</div> : null
}
