/* @flow */
import * as React from 'react'
import { Subject } from 'rxjs/Subject'
import { share } from 'rxjs/operators'
import type { Observable } from 'rxjs/Observable'

import { focus } from './focus'
import { Icon } from '../common/icon'
import { send } from '../event'
import { AutoList as List } from '../common/list/auto'
import { Item as ListItem } from '../common/list/item'
import { Expand } from '../common/animation/expand'
import { localize } from '../localization'
import S from './item.css'

export opaque type Direct = Symbol
export opaque type Indirect = Symbol
export const DIRECT: Direct = Symbol('Direct')
export const INDIRECT: Indirect = Symbol('Indirect')

const reorderedSubject = new Subject()
export const reordered: Observable<[number, number]> = reorderedSubject.asObservable().pipe(share())

export class ItemInfo {
  title: string
  icon: string
  children: ?ItemInfo[]
  selected: ?(Direct | Indirect)
  enabled: boolean
  isReorderable: boolean
  action: () => void

  constructor(title: string, icon: string, action: () => void) {
    this.title = title
    this.icon = icon
    this.children = null
    this.selected = null
    this.enabled = true
    this.isReorderable = false
    this.action = action
  }

  /**
   * Selects or deselects this item
   *
   * @param {boolean} selected Whether the item should be selected
   * @returns {this}
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
   * @returns {this}
   */
  withChildren(children: ?ItemInfo[]): ItemInfo {
    this.children = children
    return this
  }

  /**
   * Enables or disables this item
   *
   * @param {boolean} enabled Whether the item should be enabled
   * @returns {this}
   */
  enable(enabled: boolean, nested: boolean = false): ItemInfo {
    this.enabled = enabled
    if (nested && this.children) {
      this.children = this.children.map(child => child.enable(enabled))
    }
    return this
  }

  /**
   * Sets this item to be reorderable
   *
   * @returns {this}
   */
  reorderable() {
    this.isReorderable = true
    return this
  }
}

export type Props = ItemInfo & {
  depth?: number,
}

const DEPTH_INDENT = 34

function onNavigationListReordered(value: number, index: number) {
  reorderedSubject.next([value, index])
}

export function Item({ title, action, icon, depth, selected, enabled, children, value }: Props) {
  depth = depth || 0
  let indicator = S.indicatorDefault
  if (selected === DIRECT) {
    indicator = S.indicatorSelected
  } else if (selected === INDIRECT) {
    indicator = S.indicatorDeep
  }

  const onClick = () => {
    focus()
    if (enabled) {
      action()
    }
  }

  const isReorderable = (children || []).some(child => child.isReorderable)

  return (
    <div className={S.container} onClick={onClick}>
      <div className={`${S.item}  ${enabled ? '' : S.disabled}`}>
        <div className={`${S.indicator} ${indicator}`} />
        <div className={S.indent} style={{ width: depth * DEPTH_INDENT}} />
        <Icon name={icon} className={S.icon} />
        <span className={S.title}>{ localize(title) }</span>
      </div>
      {/* $FlowIgnore: maybe I typed it wrong? but looks like Flow is just dumb */}
      <Expand className={S.children}>
        <List dataSource={children || []} reorderable={isReorderable ? onNavigationListReordered : null}>
          { (child, key, extraProps) =>
              <ListItem key={`child_${key}`} {...extraProps} reorderable={isReorderable}>
                {/* $FlowIgnore: apparently can't tell that ItemInfo is Props */}
                <Item {...child} depth={depth + 1}/>
              </ListItem>
          }
        </List>
      </Expand>
    </div>
  )
}
