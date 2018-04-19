/* @flow */
import * as React from 'react'

import S from './tooltip.css'

export type Props = {
  title: React.Node,
  children?: React.Node,
}

export function Tooltip({ title, children }: Props) {
  return (
    <div className={S.container}>
      <div className={S.target} tabIndex={0}>
        { children }
      </div>
      <div className={S.tooltip}>
        { title }
      </div>
    </div>
  )
}
