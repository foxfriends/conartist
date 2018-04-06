/* @flow */
export type Page = Splash | Dashboard | Products | Prices | Conventions | Settings

export type Splash = {| name: 'splash' |}
export type Dashboard = {| name: 'dashboard' |}
export type Products = {| name: 'products' |}
export type Prices = {| name: 'prices' |}
export type Conventions = {| name: 'conventions' |}
export type Settings = {| name: 'settings' |}

export type Name = $PropertyType<Page, 'name'>

export const splash: Splash = { name: 'splash' }
export const dashboard: Dashboard = { name: 'dashboard' }
export const products: Products = { name: 'products' }
export const prices: Prices = { name: 'prices' }
export const conventions: Conventions = { name: 'conventions' }
export const settings: Settings = { name: 'settings' }
