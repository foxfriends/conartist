/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props = {
  children: React.Node,
}

export function Table({ children }: Props) {
  return (
    <div className={S.table}>
      { children }
    </div>
  )
}
