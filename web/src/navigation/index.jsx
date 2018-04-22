/* @flow */
import * as React from 'react'

import { Item, ItemInfo } from './item'
import { l } from '../localization'
import * as navigate from '../update/navigate'
import { model } from '../model'
import type { ProductType } from '../model/product-type'
import type { Props as ItemProps } from './item'
import S from './index.css'

export type Props = {
  items: ItemInfo[]
}

export function Navigation({ items }: Props) {
  return (
    <div className={S.container}>
      <nav className={S.nav}>
        {/* $FlowIgnore: apparently can't tell that ItemInfo is Props */}
        { items.map((item, key) => <Item {...item} key={`nav_item_${key}`} />) }
      </nav>
    </div>
  )
}

export class NavInfo {
  items: ItemInfo[]

  /**
   * The standard all deselected options
   */
  static get default(): NavInfo {
    const options = [
      new ItemInfo('Dashboard', 'dashboard', navigate.dashboard),
      new ItemInfo('Products', 'shopping_basket', navigate.products),
      new ItemInfo('Prices', 'attach_money', navigate.prices),
      new ItemInfo('Conventions', 'event', navigate.conventions),
      new ItemInfo('Settings', 'settings', navigate.settings),
    ]
    const { user } = model.getValue()
    if (user && user.clearance >= 1) {
      options.push(new ItemInfo('Admin', 'security', navigate.admin))
    }

    return new NavInfo(options)
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
    this.items = this.items.map(item => item.withChildren(item.title === option ? children : null).select(item.title === option))
    return this
  }

  /**
   * Enables a specific option, disabling the rest
   *
   * @param option {?string} The option to leave enabled. Leave out to enable all
   */
  enable(option?: string, nested: boolean = false): NavInfo {
    this.items = this.items.map(item => item.enable(!option || item.title === option, nested))
    return this
  }

  /**
   * Disables all the options
   */
  disable(nested: boolean = false): NavInfo {
    this.items = this.items.map(item => item.enable(false, nested))
    return this
  }

  static forProductType({ id, name, discontinued }: ProductType): ItemInfo[] {
    if (discontinued) { return [] }
    return [new ItemInfo(name, 'remove', navigate.scrollTo('product-type', id))]
  }
}
