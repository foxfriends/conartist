/* @flow */
import * as React from 'react'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Observable } from 'rxjs'

import { Toolbar, status as toolbarStatus } from './toolbar'
import * as toolbarAction from './toolbar/action'
import { ResendVerificationEmail } from './api/resend-verification-email'
import { Navigation, NavInfo } from './navigation'
import { INDIRECT } from './navigation/item'
import { Content } from './content'
import { Dialog } from './dialog'
import { Button } from './common/button'
import { model } from './model'
import { Footer } from './footer'
import { toast, Toast } from './toast'
import { by, Asc } from './util/sort'
import { isSignedIn } from './util/is-signed-in'
import { l } from './localization'
import * as page from './model/page'
import type { Model } from './model'
import type { Props as ToolbarProps } from './toolbar'
import type { Props as FooterProps } from './footer'
import type { Props as NavigationProps } from './navigation'
import type { Props as ContentProps } from './content'
import type { Props as DialogProps } from './dialog'
import S from './con-artist.css'
import { Storage } from './storage'

type Props = {}
type State = {
  toolbar: ?ToolbarProps,
  footer: ?FooterProps,
  navigation: ?NavigationProps,
  content: ?ContentProps,
  dialog: ?DialogProps,
  toast: React.Node,
}

export class ConArtist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      toolbar: { primary: null, secondary: null, tertiary: null },
      footer: null,
      navigation: null,
      content: null,
      dialog: null,
      toast: null,
    }
  }

  componentDidMount() {
    // don't care to dispose this observable because it is the app and should never be disposed!
    toast.subscribe(toast => this.setState({ toast }))
    combineLatest(model, toolbarStatus, this.computeState.bind(this))
      .subscribe(newState => this.setState(newState))
  }

  dismissToast() {
    this.setState({ toast: null })
  }

  computeState(model: $ReadOnly<Model>, toolbar: ToolbarProps): State {
    const state = { ...this.state }

    switch(model.page.name) {
      case 'splash':
        state.toolbar = { primary: toolbarAction.SignUp, secondary: toolbarAction.LogIn, tertiary: null }
        state.navigation = null
        state.content = { name: 'static', content: 'splash' }
        break

      case 'dashboard':
        state.toolbar = { primary: null, secondary: null, tertiary: null, pageIcon: 'dashboard' }
        state.content = { name: 'dashboard' }
        state.navigation = NavInfo.default.select('Dashboard')
        break

      case 'products':
        state.toolbar = {
          primary: toolbarAction.EditProducts,
          secondary: toolbarAction.ExportProducts,
          tertiary: toolbarAction.ImportProducts,
          pageIcon: 'shopping_basket',
        }
        state.content = { name: 'products', productTypes: model.productTypes, products: model.products }
        state.navigation = NavInfo.default.select('Products', [].concat(
          ...model.productTypes.sort(by(['sort', Asc], ['id', Asc])).map(NavInfo.forProductType)
        ))
        break

      case 'edit-products':
        state.toolbar = toolbar
        state.content = { name: 'edit-products', productTypes: model.productTypes, products: model.products, pageIcon: 'shopping_basket' }
        state.navigation = NavInfo.default
          .select('Products', [].concat(
            ...model.productTypes
              .sort(by(['sort', Asc], ['id', Asc]))
              .map(NavInfo.forReorderableProductType)
          ))
          .disable()
        break

      case 'prices':
        state.toolbar = { primary: model.productTypes.filter(({ discontinued }) => !discontinued).length ? toolbarAction.EditPrices : null, secondary: null, tertiary: null, pageIcon: 'attach_money' }
        state.content = { name: 'prices', prices: model.prices, productTypes: model.productTypes, products: model.products }
        state.navigation = NavInfo.default.select('Prices', [].concat(
          ...model.productTypes.sort(by(['sort', Asc], ['id', Asc])).map(NavInfo.forProductType)
        ))
        break

      case 'edit-prices':
        state.toolbar = toolbar
        state.content = { name: 'edit-prices', prices: model.prices, productTypes: model.productTypes, products: model.products, pageIcon: 'attach_money' }
        state.navigation = NavInfo.default
          .select('Prices', [].concat(
            ...model.productTypes.sort(by(['sort', Asc], ['id', Asc])).map(NavInfo.forProductType)
          ))
          .disable()
        break

      case 'sales':
        state.toolbar = { primary: toolbarAction.NewSale, secondary: null, tertiary: null, pageIcon: 'table_chart' }
        state.content = { name: 'sales' }
        state.navigation = NavInfo.default.select('Sales')
        break

      case 'conventions':
        state.toolbar = { primary: toolbarAction.SearchConventions, secondary: null, tertiary: null, pageIcon: 'event' }
        state.content = { name: 'conventions', conventions: model.conventions }
        state.navigation = NavInfo.default.select('Conventions')
        break

      case 'search-conventions':
        const updateSearch = search => this.setState({ content: { ...this.state.content, search } })
        const showFilters = () => this.setState({ content: { ...this.state.content, advanced: !this.state.content.advanced }})
        state.toolbar = {
          textField: {
            title: l`Search`,
            onChange: updateSearch,
            action: { icon: 'tune', onClick: showFilters }
          },
          primary: null,
          secondary: null,
          tertiary: null,
          pageIcon: 'event'
        }
        state.content = { name: 'search-conventions', search: '', advanced: false }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'convention-details':
        state.toolbar = { primary: null, secondary: null, tertiary: null, pageIcon: 'event' }
        state.content = { name: 'convention-details', convention: model.page.convention }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'convention-records':
        const { convention } = model.page
        state.toolbar = { primary: null, secondary: toolbarAction.ExportRecords(convention), tertiary: null, pageIcon: 'event' }
        state.content = { name: 'convention-records', convention }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'convention-stats':
        state.toolbar = { primary: null, secondary: null, tertiary: null, pageIcon: 'event' }
        state.content = { name: 'convention-stats', convention: model.page.convention }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'convention-user-info':
        state.toolbar = { primary: null, secondary: null, tertiary: null, pageIcon: 'event' }
        state.content = { name: 'convention-user-info', convention: model.page.convention }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'settings':
        state.toolbar = { primary: null, secondary: null, tertiary: null, pageIcon: 'settings' }
        const { email = '', name: username = '', verified } = model.user || {}
        state.content = { name: 'settings', email, username, verified, settings: model.settings }
        state.navigation = NavInfo.default.select('Settings')
        break

      case 'admin':
        state.toolbar = { primary: null, secondary: null, tertiary: null, pageIcon: 'security' }
        state.content = { name: 'admin' }
        state.navigation = NavInfo.default.select('Admin')
        break

      case 'terms-of-service':
        state.navigation = isSignedIn() ? NavInfo.default : null
        state.content = { name: 'static', content: 'terms-of-service' }
        break

      case 'privacy-policy':
        state.navigation = isSignedIn() ? NavInfo.default : null
        state.content = { name: 'static', content: 'privacy-policy' }
        break

      case 'faq':
        state.navigation = isSignedIn() ? NavInfo.default : null
        state.content = { name: 'static', content: 'faq' }
        break

      case 'suggestions':
        state.toolbar = { primary: toolbarAction.CreateSuggestion, secondary: null, tertiary: null, pageIcon: 'settings' }
        state.content = { name: 'suggestions', suggestions: model.suggestions }
        state.navigation = NavInfo.default.select('Settings', [], INDIRECT)
        break

      case 'verify':
        if (isSignedIn()) {
          state.toolbar = { primary: null, secondary: null, tertiary: null }
          state.navigation = NavInfo.default
        } else {
          state.toolbar = { primary: toolbarAction.LogIn, secondary: null, tertiary: null }
          state.navigation = null
        }
        state.content = { name: 'verify', code: model.page.code }
        break

      case 'reset-password':
        state.toolbar = { primary: isSignedIn() ? null : toolbarAction.LogIn, secondary: null, tertiary: null }
        state.navigation = null
        state.content = { name: 'reset-password', code: model.page.code }
        break

      default:
        console.error(`Unhandled page name: ${model.page.name}! Ignoring`)
    }

    if (model.dialog) {
      switch (model.dialog.name) {
        case 'signup':
          state.dialog = { name: 'signup', step: model.dialog.step }
          break

        case 'signin':
          state.dialog = { name: 'signin' }
          break

        case 'change-password':
          state.dialog = { name: 'change-password' }
          break

        case 'change-email':
          state.dialog = { name: 'change-email' }
          break

        case 'change-name':
          state.dialog = { name: 'change-name' }
          break

        case 'change-language':
          state.dialog = { name: 'change-language' }
          break

        case 'change-currency':
          state.dialog = { name: 'change-currency' }
          break

        case 'reset-password':
          state.dialog = { name: 'reset-password', email: model.dialog.email }
          break

        case 'create-suggestion':
          state.dialog = { name: 'create-suggestion' }
          break

        case 'new-sale': {
          const prices = model.page.convention ? model.page.convention.prices : model.prices
          const productTypes = model.page.convention ? model.page.convention.productTypes : model.productTypes
          const products = model.page.convention ? model.page.convention.products : model.products
          state.dialog = { name: 'new-sale', convention: model.page.convention, prices, products, productTypes, record: model.dialog.record }
          break
        }

        case 'new-expense':
          state.dialog = { name: 'new-expense', convention: model.page.convention, expense: model.dialog.expense }
          break

        case 'export':
        case 'import':
          state.dialog = model.dialog
          break

        default:
          state.dialog = null
          if (model.dialog) {
            console.error(`Unhandled dialog name: ${model.dialog.name}! Ignoring`)
          }
      }
    } else {
      state.dialog = null
    }

    if (model.user && model.user.verified === false) {
      state.footer = {
        content: (
          <>
            <span className={S.boldFooter}>{l`Don't forget to verify your email!`}</span>
            <Button className={S.resendEmailButton} priority='primary' action={() => new ResendVerificationEmail().send().subscribe()}>
              {l`Resend verification email`}
            </Button>
          </>
        )
      }
    }

    return state
  }

  render() {
    const { toolbar, footer, navigation, content, dialog, toast } = this.state
    return (
      <>
        { toolbar ? <Toolbar {...toolbar} className={navigation ? '' : 'signedOut'} /> : null }
        <div className={`${S.container} ${navigation ? '' : 'signedOut'}`}>
          { navigation ? <Navigation {...navigation} /> : null }
          {/* $FlowIgnore: Flow doesn't understand enums properly */}
          { content ? <Content {...content} /> : null }
          {/* $FlowIgnore: Flow doesn't understand enums properly */}
          { dialog ? <Dialog {...dialog} /> : null }
        </div>
        <Toast onClick={() => this.dismissToast()}>
          {/* $FlowIgnore: does not understand defaulting missing args */}
          { toast || null }
        </Toast>
        { footer ? <Footer {...footer} className={navigation ? '' : 'signedOut'} /> : null }
      </>
    )
  }
}
