/* @flow */
import * as React from 'react'

import S from './tooltip.css'

export type Props = {
  title: React.Node,
  children?: React.Node,
  className?: string,
}

export function Tooltip({ title, children, className }: Props) {
  return (
    <div className={`${S.container} ${className || ''}`}>
      <div className={S.target} tabIndex={0}>
        { children }
      </div>
      <div className={S.tooltip}>
        { title }
      </div>
    </div>
  )
}
