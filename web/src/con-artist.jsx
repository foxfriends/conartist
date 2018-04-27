/* @flow */
import * as React from 'react'
import type { Observable } from 'rxjs/Observable'
import { combineLatest } from 'rxjs/observable/combineLatest'
import { map } from 'rxjs/operators/map'

import { Toolbar, status as toolbarStatus } from './toolbar'
import * as toolbarAction from './toolbar/action'
import { Navigation, NavInfo } from './navigation'
import { INDIRECT } from './navigation/item'
import { Content } from './content'
import { Dialog } from './dialog'
import { model } from './model'
import * as page from './model/page'
import type { Model } from './model'
import type { Props as ToolbarProps } from './toolbar'
import type { Props as NavigationProps } from './navigation'
import type { Props as ContentProps } from './content'
import type { Props as DialogProps } from './dialog'
import S from './con-artist.css'
import { Storage } from './storage'

type Props = {}
type State = {
  toolbar: ?ToolbarProps,
  navigation: ?NavigationProps,
  content: ?ContentProps,
  dialog: ?DialogProps,
}

export class ConArtist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      toolbar: { primary: null, secondary: null },
      navigation: null,
      content: null,
      dialog: null,
    }
  }

  componentDidMount() {
    // don't care to dispose this observable because it is the app and should never be disposed!
    combineLatest(model, toolbarStatus, this.computeState.bind(this))
      .subscribe(newState => this.setState(newState))
  }

  computeState(model: $ReadOnly<Model>, toolbar: ToolbarProps): State {
    const state = { ...this.state }

    switch(model.page.name) {
      case 'splash':
        state.toolbar = { primary: toolbarAction.SignUp, secondary: toolbarAction.LogIn }
        state.navigation = null
        state.content = null
        break

      case 'dashboard':
        state.toolbar = { primary: null, secondary: null }
        state.content = { name: 'placeholder' }
        state.navigation = NavInfo.default.select('Dashboard')
        break

      case 'products':
        state.toolbar = { primary: toolbarAction.EditProducts, secondary: null }
        state.content = { name: 'products', productTypes: model.productTypes, products: model.products }
        state.navigation = NavInfo.default.select('Products', [].concat(...model.productTypes.map(NavInfo.forProductType)))
        break

      case 'edit-products':
        state.toolbar = toolbar
        state.content = { name: 'edit-products', productTypes: model.productTypes, products: model.products }
        state.navigation = NavInfo.default.select('Products', [].concat(...model.productTypes.map(NavInfo.forProductType))).disable()
        break

      case 'prices':
        state.toolbar = { primary: model.productTypes.filter(({ discontinued }) => !discontinued).length ? toolbarAction.EditPrices : null, secondary: null }
        state.content = { name: 'prices', prices: model.prices, productTypes: model.productTypes, products: model.products }
        state.navigation = NavInfo.default.select('Prices', [].concat(...model.productTypes.map(NavInfo.forProductType)))
        break

      case 'edit-prices':
        state.toolbar = toolbar
        state.content = { name: 'edit-prices', prices: model.prices, productTypes: model.productTypes, products: model.products }
        state.navigation = NavInfo.default.select('Prices', [].concat(...model.productTypes.map(NavInfo.forProductType))).disable()
        break

      case 'conventions':
        state.toolbar = { primary: toolbarAction.SearchConventions, secondary: null }
        state.content = { name: 'conventions', conventions: model.conventions }
        state.navigation = NavInfo.default.select('Conventions')
        break

      case 'search-conventions':
        state.toolbar = { primary: null, secondary: null }
        state.content = { name: 'search-conventions' }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'convention-details':
        state.toolbar = { primary: null, secondary: null }
        state.content = { name: 'convention-details', convention: model.page.convention }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'convention-user-info':
        state.toolbar = { primary: null, secondary: null }
        state.content = { name: 'convention-user-info', convention: model.page.convention }
        state.navigation = NavInfo.default.select('Conventions', [], INDIRECT)
        break

      case 'settings':
        state.toolbar = { primary: null, secondary: null }
        const { email = '', name: username = '' } = model.user || {}
        state.content = { name: 'settings', email, username, settings: model.settings }
        state.navigation = NavInfo.default.select('Settings')
        break

      case 'admin':
        state.toolbar = { primary: null, secondary: null }
        state.content = { name: 'admin' }
        state.navigation = NavInfo.default.select('Admin')
        break

      case 'terms-of-service':
        state.navigation = null
        state.content = { name: 'static', content: 'terms-of-service' }
        break

      case 'privacy-policy':
        state.navigation = null
        state.content = { name: 'static', content: 'privacy-policy' }
        break

      default:
        console.error(`Unhandled page name: ${model.page.name}! Ignoring`)
    }

    if (model.dialog) {
      switch (model.dialog.name) {
        case 'signup':
          state.dialog = {
            name: 'signup',
            step: model.dialog.step,
          }
          break
        case 'signin':
          state.dialog = {
            name: 'signin'
          }
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

    return state
  }

  render() {
    let { toolbar, navigation, content, dialog } = this.state
    return (
      <>
        { toolbar ? <Toolbar {...toolbar} /> : null }
        <div className={S.container}>
          { navigation ? <Navigation {...navigation} /> : null }
          {/* $FlowIgnore: Flow doesn't understand enums properly */}
          { content ? <Content {...content} /> : null }
          {/* $FlowIgnore: Flow doesn't understand enums properly */}
          { dialog ? <Dialog {...dialog} /> : null }
        </div>
      </>
    )
  }
}
