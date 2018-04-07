/* @flow */
import * as React from 'react'

import S from './tooltip.css'

export type Props = {
  title: string,
  children?: React.Node,
}

export function Tooltip({ title, children }: Props) {
  return (
    <div className={S.target}>
      { children }
    </div>
  )
}
