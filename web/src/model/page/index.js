/* @flow */
export type Page = Splash | Dashboard | Products | EditProducts | Prices | Conventions | Settings | TermsOfService | PrivacyPolicy

export type Splash = {| name: 'splash' |}
export type Dashboard = {| name: 'dashboard' |}
export type Products = {| name: 'products' |}
export type EditProducts = {| name: 'edit-products' |}
export type Prices = {| name: 'prices' |}
export type Conventions = {| name: 'conventions' |}
export type Settings = {| name: 'settings' |}
export type TermsOfService = {| name: 'terms-of-service' |}
export type PrivacyPolicy = {| name: 'privacy-policy' |}

export type Name = $PropertyType<Page, 'name'>

export const splash: Splash = { name: 'splash' }
export const dashboard: Dashboard = { name: 'dashboard' }
export const products: Products = { name: 'products' }
export const editProducts: EditProducts = { name: 'edit-products' }
export const prices: Prices = { name: 'prices' }
export const conventions: Conventions = { name: 'conventions' }
export const settings: Settings = { name: 'settings' }
export const termsOfService: TermsOfService = { name: 'terms-of-service' }
export const privacyPolicy: PrivacyPolicy = { name: 'privacy-policy' }
