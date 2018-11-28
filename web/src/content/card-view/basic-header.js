/* @flow */
import * as React from 'react'
import S from './basic-header.css'

export type Props = {
  children: React.Node,
}

export function BasicHeader({ children }: Props) {
  return children ? <div className={S.title}>{ children }</div> : null
}
