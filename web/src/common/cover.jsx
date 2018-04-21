/* @flow */
import * as React from 'react'
import S from './cover.css'

export type Props = {
  fixed?: boolean,
  className?: string,
  onClick?: () => void,
}

export function Cover({ fixed, onClick, className }: Props) {
  return <div className={`${S.cover} ${className || ''} ${fixed ? S.fixed : ''}`} onClick={onClick}/>
}
