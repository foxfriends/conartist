/* @flow */
import * as React from 'react'

import { Item } from './item'
import type { Props as ItemProps } from './item'
import S from './index.css'
import * as navigate from '../update/navigate'
import { l } from '../localization'

function itemToProps({ title, icon, selected, children, enabled, action }: ItemInfo): ItemProps[] {
  return (
      [].concat(
        [{ title, icon, selected, depth: 0, enabled, action }],
        ...(children || [])
          .map(child => itemToProps(child).map(props => { props.depth += 1; return props }))
      )
    )
}

export type Props = {
  items: ItemInfo[]
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

  constructor(title: string, icon: string, action: () => void) {
    this.title = title
    this.icon = icon
    this.children = null
    this.selected = false
    this.enabled = true
    this.action = action
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

export class NavInfo {
  items: ItemInfo[]

  /**
   * The standard all deselected options
   */
  static get default(): NavInfo {
    return new NavInfo([
      new ItemInfo(l`Dashboard`, 'dashboard', navigate.dashboard),
      new ItemInfo(l`Products`, 'shopping_basket', navigate.products),
      new ItemInfo(l`Prices`, 'attach_money', navigate.prices),
      new ItemInfo(l`Conventions`, 'event', navigate.conventions),
      new ItemInfo(l`Settings`, 'settings', navigate.settings),
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
  select(option: string, children: ?ItemInfo[]): NavInfo {
    this.items = this.items.map(item => item.select(item.title === option).withChildren(item.title === option ? children : null))
    return this
  }

  /**
   * Enables a specific option, disabling the rest
   *
   * @param option {?string} The option to leave enabled. Leave out to enable all
   */
  enable(option?: string): NavInfo {
    this.items = this.items.map(item => item.enable(!option || item.title === option))
    return this
  }

  /** 
   * Disables all the options
   */
  disable(): NavInfo {
    this.items = this.items.map(item => item.enable(false))
    return this
  }
}
