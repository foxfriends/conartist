/* @flow */
import * as React from 'react'

import { Item } from './item'
import type { Props as ItemProps } from './item'
import S from './index.css'

export type ItemInfo = {
  title: string,
  icon: string,
  children: ?Item[],
  selected: boolean,
  enabled: boolean,
  action: () => void,
}

export type Props = {
  items: Item[],
}

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

Navigation.default = {
  items: [
    { title: 'Dashboard', icon: 'dashboard', children: null, selected: false, enabled: true, action() {} },
    { title: 'Products', icon: 'shopping_basket', children: null, selected: false, enabled: true, action() {} },
    { title: 'Prices', icon: 'attach_money', children: null, selected: false, enabled: true, action() {} },
    { title: 'Conventions', icon: 'event', children: null, selected: false, enabled: true, action() {} },
    { title: 'Settings', icon: 'settings', children: null, selected: false, enabled: true, action() {} },
  ],
}
