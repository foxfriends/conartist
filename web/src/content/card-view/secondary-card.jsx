/* @flow */
import * as React from 'react'

import { BasicHeader } from './basic-header'
import S from './secondary-card.css'

export type Props = {
  title: string,
  top: number,
  children: React.Node,
}

export function SecondaryCard({ title, children, top }: Props) {
  return (
    <div className={S.card} style={{ top }}>
      <div className={S.header}>
        <BasicHeader>{ title }</BasicHeader>
      </div>
      <div className={S.content}>
        { children }
      </div>
    </div>
  )
}
