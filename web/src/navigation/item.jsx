/* @flow */
import * as React from 'react'

import { Icon } from '../common/icon'
import { localize } from '../localization'
import S from './item.css'

export type Props = {
  title: string,
  action: () => void,
  icon: string,
  depth: ?number,
  selected: boolean,
  enabled: boolean,
}

const DEPTH_INDENT = 34

export function Item({ title, action, icon, depth, selected, enabled }: Props) {
  depth = depth || 0
  return (
    <div className={`${S.item} ${enabled ? '' : S.disabled}`} onClick={action}>
      <div className={selected ? S.indicatorSelected : S.indicatorDefault} />
      <div className={S.indent} style={{ width: `${depth * DEPTH_INDENT}px`}} />
      <Icon name={icon} />
      <span className={S.title}>{ localize(title) }</span>
    </div>
  )
}
