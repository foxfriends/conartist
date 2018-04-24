/* @flow */
import * as React from 'react'
import S from './basic-header.css'

export type Props = {
  title: React.Node,
}

export function BasicHeader({ title }: Props) {
  return title ? <div className={S.title}>{ title }</div> : null
}
