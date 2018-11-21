/* @flow */
import type { Convention } from '../convention'

export type Page = Splash
                 | Dashboard
                 | Products
                 | EditProducts
                 | Prices
                 | EditPrices
                 | Conventions
                 | SearchConventions
                 | ConventionDetails
                 | ConventionRecords
                 | ConventionStats
                 | ConventionUserInfo
                 | Settings
                 | TermsOfService
                 | PrivacyPolicy
                 | Suggestions
                 | ResetPassword
                 | Verify
                 | Admin

export type Splash = {| name: 'splash' |}
export type Dashboard = {| name: 'dashboard' |}
export type Products = {| name: 'products' |}
export type EditProducts = {| name: 'edit-products' |}
export type Prices = {| name: 'prices' |}
export type EditPrices = {| name: 'edit-prices' |}
export type Conventions = {| name: 'conventions' |}
export type SearchConventions = {| name: 'search-conventions' |}
export type ConventionDetails = {| name: 'convention-details', convention: Convention |}
export type ConventionRecords = {| name: 'convention-records', convention: Convention |}
export type ConventionStats = {| name: 'convention-stats', convention: Convention |}
export type ConventionUserInfo = {| name: 'convention-user-info', convention: Convention |}
export type Settings = {| name: 'settings' |}
export type TermsOfService = {| name: 'terms-of-service' |}
export type PrivacyPolicy = {| name: 'privacy-policy' |}
export type Suggestions = {| name: 'suggestions' |}
export type Verify = {| name: 'verify', code: string |}
export type ResetPassword = {| name: 'reset-password', code: string |}
export type Admin = {| name: 'admin' |}

export const splash: Splash = { name: 'splash' }
export const dashboard: Dashboard = { name: 'dashboard' }
export const products: Products = { name: 'products' }
export const editProducts: EditProducts = { name: 'edit-products' }
export const prices: Prices = { name: 'prices' }
export const editPrices: EditPrices = { name: 'edit-prices' }
export const conventions: Conventions = { name: 'conventions' }
export const searchConventions: SearchConventions = { name: 'search-conventions' }
export const conventionDetails = (convention: Convention): ConventionDetails => ({ name: 'convention-details', convention })
export const conventionRecords = (convention: Convention): ConventionRecords => ({ name: 'convention-records', convention })
export const conventionStats = (convention: Convention): ConventionStats => ({ name: 'convention-stats', convention })
export const conventionUserInfo = (convention: Convention): ConventionUserInfo => ({ name: 'convention-user-info', convention })
export const settings: Settings = { name: 'settings' }
export const termsOfService: TermsOfService = { name: 'terms-of-service' }
export const privacyPolicy: PrivacyPolicy = { name: 'privacy-policy' }
export const suggestions: Suggestions = { name: 'suggestions' }
export const verify = (code: string): Verify => ({ name: 'verify', code })
export const resetPassword = (code: string): ResetPassword => ({ name: 'reset-password', code })
export const admin: Admin = { name: 'admin' }
