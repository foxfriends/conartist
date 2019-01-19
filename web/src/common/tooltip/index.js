/* @flow */
import * as React from 'react'

import S from './index.css'

export type Props = {
  title: React.Node,
  clickable: boolean,
  children?: React.Node,
  className?: string,
}

export function Tooltip({ title, children, className, clickable = true }: Props) {
  return (
    <div className={`${S.container} ${clickable ? S.clickable : ''} ${className || ''}`}>
      <div className={S.target} tabIndex={0}>
        { children }
      </div>
      <div className={S.tooltip}>
        { title }
      </div>
    </div>
  )
}
