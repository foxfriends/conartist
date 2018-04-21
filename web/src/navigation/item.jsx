/* @flow */
import * as React from 'react'

import { Icon } from '../common/icon'
import { List } from '../common/list'
import { Item as ListItem } from '../common/list/item'
import { localize } from '../localization'
import S from './item.css'

export type Props = {
  title: string,
  action: () => void,
  icon: string,
  selected: boolean,
  enabled: boolean,
  children: ?Props[],
  depth?: number,
}

const DEPTH_INDENT = 34

export function Item({ title, action, icon, depth, selected, enabled, children }: Props) {
  depth = depth || 0
  return (
    <div className={`${S.container} ${enabled ? '' : S.disabled}`} onClick={() => enabled && action()}>
      <div className={S.item}>
        <div className={selected ? S.indicatorSelected : S.indicatorDefault} />
        <div className={S.indent} style={{ width: depth * DEPTH_INDENT}} />
        <Icon name={icon} />
        <span className={S.title}>{ localize(title) }</span>
      </div>
      { children && children.length
          ? <List className={S.childList} dataSource={children}>
              { (child, key) =>
                  <ListItem key={`child_${key}`} className={S.childItem}>
                    <Item {...child} depth={depth + 1}/>
                  </ListItem>
              }
            </List>
          : null
      }
    </div>
  )
}
