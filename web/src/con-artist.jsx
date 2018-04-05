/* @flow */
import * as React from 'react'
import { Toolbar } from './toolbar'
import * as toolbarAction from './toolbar/action'
import { Navigation, Props as NavigationProps} from './navigation'
import { Content } from './content'
import { Dialog } from './dialog'
import { model } from './model'
import * as page from './model/page'
import type { Model } from './model'
import type { Props as ToolbarProps } from './toolbar'
import type { Props as ContentProps } from './content'
import type { Props as DialogProps } from './dialog'
import S from './con-artist.css'

import 'rxjs/add/operator/map'

type Props = {}
type State = {
  toolbar: ToolbarProps,
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
        // TODO: copy the object so that mutation doesn't actually happen
        //       or figure out why immutable wasn't working at all here...
        const state = this.state

        switch(model.page.name) {
          case 'splash':
            state.toolbar = { primary: toolbarAction.SignUp, secondary: toolbarAction.LogIn }
            state.navigation = NavigationProps.default.select('Dashboard')
            state.content = { cards: [] }
            break
          default:
            console.error(`Unhandled page name: ${model.page.name}! Ignoring`)
        }

        if (model.dialog) {
          switch ((model.dialog || {}).name) {
            case 'signup':
              break
            case 'login':
              break
            default:
              state.dialog = null
          }
        }

        return state
      })
      .subscribe(newState => this.setState(newState))
  }

  render() {
    let { toolbar, navigation, content, dialog } = this.state
    return (
      <>
        <Toolbar {...toolbar} />
        <div className={S.container}>
          { navigation ? <Navigation {...navigation} /> : null }
          { content ? <Content {...content} /> : null }
          { dialog ? <Dialog {...dialog} /> : null }
        </div>
      </>
    )
  }
}
