/* @flow */
import * as React from 'react'

import { Icon } from '../common/icon'
import { AutoList as List } from '../common/list/auto'
import { Item as ListItem } from '../common/list/item'
import { Expand } from '../common/animation/expand'
import { localize } from '../localization'
import S from './item.css'

export opaque type Direct = Symbol
export opaque type Indirect = Symbol
export const DIRECT: Direct = Symbol('Direct')
export const INDIRECT: Indirect = Symbol('Indirect')

export class ItemInfo {
  title: string
  icon: string
  children: ?ItemInfo[]
  selected: ?(Direct | Indirect)
  enabled: boolean
  action: () => void

  constructor(title: string, icon: string, action: () => void) {
    this.title = title
    this.icon = icon
    this.children = null
    this.selected = null
    this.enabled = true
    this.action = action
  }

  /**
   * Selects or deselects this item
   *
   * @param selected {boolean} Whether the item should be selected
   */
  select(selected: boolean, directness: Direct | Indirect = DIRECT): ItemInfo {
    this.selected = selected ? directness : null
    if (this.children) {
      this.children = this.children.map(child => child.select(selected, directness))
    }
    return this
  }

  /**
   * Sets the children of this item
   *
   * @param children {?ItemInfo[]} The children to set
   */
  withChildren(children: ?ItemInfo[]): ItemInfo {
    this.children = children
    return this
  }

  /**
   * Enables or disables this item
   *
   * @param enabled {boolean} Whether the item should be enabled
   */
  enable(enabled: boolean, nested: boolean = false): ItemInfo {
    this.enabled = enabled
    if (nested && this.children) {
      this.children = this.children.map(child => child.enable(enabled))
    }
    return this
  }
}

export type Props = ItemInfo & {
  depth?: number,
}

const DEPTH_INDENT = 34

export function Item({ title, action, icon, depth, selected, enabled, children }: Props) {
  depth = depth || 0
  let indicator = S.indicatorDefault
  if (selected === DIRECT) {
    indicator = S.indicatorSelected
  } else if (selected === INDIRECT) {
    indicator = S.indicatorDeep
  }
  return (
    <div className={S.container} onClick={() => enabled && action()}>
      <div className={`${S.item}  ${enabled ? '' : S.disabled}`}>
        <div className={indicator} />
        <div className={S.indent} style={{ width: depth * DEPTH_INDENT}} />
        <Icon name={icon} className={S.icon} />
        <span className={S.title}>{ localize(title) }</span>
      </div>
      {/* $FlowIgnore: maybe I typed it wrong? but looks like Flow is just dumb */}
      <Expand>
        <List dataSource={children || []}>
          { (child, key) =>
              <ListItem key={`child_${key}`}>
                {/* $FlowIgnore: apparently can't tell that ItemInfo is Props */}
                <Item {...child} depth={depth + 1}/>
              </ListItem>
          }
        </List>
      </Expand>
    </div>
  )
}
