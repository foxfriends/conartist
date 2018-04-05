/* @flow */
import * as React from 'react'

import { Item } from './item'
import type { Props as ItemProps } from './item'
import S from './index.css'

function itemToProps({ title, icon, selected, children, enabled, action }: ItemInfo): ItemProps[] {
  return (
      [].concat(
        [{ title, icon, selected, depth: 0, enabled, action }],
        ...(children || [])
          .map(child => itemToProps(child).map(props => { props.depth += 1; return props }))
      )
    )
}

export function Navigation({ items }: Props) {
  const itemProps = [].concat(...items.map(itemToProps))
  return (
    <nav className={S.container}>
      { itemProps.map((item, key) => <Item {...item} key={`nav_item_${key}`} />) }
    </nav>
  )
}

export class ItemInfo {
  title: string
  icon: string
  children: ?ItemInfo[]
  selected: boolean
  enabled: boolean
  action: () => void

  constructor(title: string, icon: string) {
    this.title = title
    this.icon = icon
    this.children = null
    this.selected = false
    this.enabled = true
    this.action = () => {}
  }

  /**
   * Selects or deselects this item
   *
   * @param selected {boolean} Whether the item should be selected
   */
  select(selected: boolean): ItemInfo {
    this.selected = selected
    if (this.children) {
      this.children = this.children.map(child => child.select(selected))
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
  enable(enabled: boolean): ItemInfo {
    this.enabled = enabled
    if (this.children) {
      this.children = this.children.map(child => child.enable(enabled))
    }
    return this
  }
}

export class Props {
  items: ItemInfo[]

  static get default() {
    return new Props([
      new ItemInfo('Dashboard', 'dashboard'),
      new ItemInfo('Products', 'shopping_basket'),
      new ItemInfo('Prices', 'attach_money'),
      new ItemInfo('Conventions', 'event'),
      new ItemInfo('Settings', 'settings'),
    ])
  }

  constructor(items: ItemInfo[]) {
    this.items = items
  }

  /**
   * Selects the item with the given title, optionally adding some children to the selected node
   *
   * @param option {string} The title of the item to select
   * @param children {?ItemInfo[]} Any children to add to this node
   */
  select(option: string, children: ?ItemInfo[]): Props {
    this.items = this.items.map(item => item.select(item.title === option).withChildren(item.title === option ? children : null))
    return this
  }

  /**
   * Enables a specific option, disabling the rest
   *
   * @param option {?string} The option to leave enabled. Set to null to enable all
   */
  enable(option: string): Props {
    this.items = this.items.map(item => item.enable(!option || item.title === option))
    return this
  }
}
