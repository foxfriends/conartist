/* @flow */
import * as React from 'react'
import { Toolbar } from './toolbar'
import * as toolbarAction from './toolbar/action'
import { Navigation, NavInfo } from './navigation'
import { Content } from './content'
import { Dialog } from './dialog'
import { model } from './model'
import * as page from './model/page'
import type { Model } from './model'
import type { Props as ToolbarProps } from './toolbar'
import type { Props as NavigationProps } from './navigation'
import type { Props as ContentProps } from './content'
import type { Props as DialogProps } from './dialog'
import { l } from './localization'
import S from './con-artist.css'
import { Storage } from './storage'

import 'rxjs/add/operator/map'

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
    model
      .map((model: $ReadOnly<Model>): State => {
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
            state.toolbar = { primary: null, secondary: null }
            state.content = { name: 'products', productTypes: model.productTypes, products: model.products }
            state.navigation = NavInfo.default.select('Products')
            break
          case 'prices':
            state.toolbar = { primary: null, secondary: null }
            state.content = { name: 'placeholder' }
            state.navigation = NavInfo.default.select('Prices')
            break
          case 'conventions':
            state.toolbar = { primary: null, secondary: null }
            state.content = { name: 'placeholder' }
            state.navigation = NavInfo.default.select('Conventions')
            break
          case 'settings':
            state.toolbar = { primary: null, secondary: null }
            state.content = { name: 'placeholder' }
            state.navigation = NavInfo.default.select('Settings')
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
      })
      .subscribe(newState => this.setState(newState))
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
