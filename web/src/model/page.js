/* @flow */
export type Page = Splash | Dashboard

export type Splash = {| name: 'splash' |}
export type Dashboard = {| name: 'dashboard', cards: null[] |}

export type Name = $PropertyType<Page, 'name'>

export const splash: Splash = { name: 'splash' }
export const dashboard: Dashboard = { name: 'dashboard', cards: [] }
