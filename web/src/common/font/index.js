/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props = {
  smallCaps?: boolean,
  tabular?: boolean,

  regular?: boolean,
  bold?: boolean,
  semibold?: boolean,

  className?: string,
  children?: React.Node
}

export function Font({ smallCaps, tabular, regular, bold, semibold, className, children }: Props) {
  const classNames = [
    smallCaps && S.smallCaps,
    tabular && S.tabular,
    regular && S.regular,
    bold && S.bold,
    semibold && S.semibold,
  ].filter(className => !!className)
  if (className) { classNames.push(className) }
  return <span className={classNames.join(' ')}>{ children }</span>
}
