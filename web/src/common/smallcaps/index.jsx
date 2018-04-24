/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props = {
  children?: React.Node
}

export function SmallCaps({ children }: Props) {
  return <span className={S.smallcaps}>{ children }</span>
}
