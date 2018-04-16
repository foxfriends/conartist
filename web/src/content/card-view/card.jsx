/* @flow */
import * as React from 'react'
import { Icon } from '../../common/icon'
import S from './card.css'

export type Props = { 
  className?: string,
  style?: { [string]: string | number },
  children: [React.Node, React.Node],
}

export function Card({ children: [header, content], className, style }: Props) {
  return (
    <div className={`${S.card} ${className || ''}`} style={style || {}}>
      <div className={S.header}>
        { header }
      </div>
      <div className={S.content}>
        { content }
      </div>
    </div>
  )
}
