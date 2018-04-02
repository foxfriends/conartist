/* @flow */
import * as React from 'react'
import { Record } from 'immutable'
import type { RecordOf } from 'immutable'
import { Toolbar } from './toolbar'
import * as toolbar from './toolbar'
import { Navigation } from './navigation'
import { Content } from './content'
import { Dialog } from './dialog'
import { model } from './model'
import * as page from './model/page'
import type { Model } from './model'
import type { Props as ToolbarProps } from './toolbar'
import type { Props as NavigationProps } from './navigation'
import type { Props as ContentProps } from './content'
import type { Props as DialogProps } from './dialog'
import l from './localization'

type Props = {}
type State = {
  toolbar: ToolbarProps,
  navigation: ?NavigationProps,
  content: ?ContentProps,
  dialog: ?DialogProps,
}

const StateFactory = Record({
  toolbar: { primary: null, secondary: null },
  navigation: null,
  content: null,
  dialog: null,
})

export class ConArtist extends React.Component<Props, RecordOf<State>> {
  constructor(props: Props) {
    super(props)
    this.state = StateFactory()

    model
      .map((model: Model): Record<State> => {
        let state = this.state
        switch(model.page.name) {
          case 'splash':
            state = state.merge({
              toolbar: {
                primary: toolbar.action.SignUp,
                secondary: toolbar.action.LogIn,
              },
              navigation: null,
              content: null,
            })
          default:
            console.error("Unhandled page name! Ignoring")
        }
        return state
      })
      .subscribe(this.setState.bind(this))
  }

  render() {
    return (
      <>
        <Toolbar {...this.state.toolbar} />
        <div>
          { this.state.navigation ? <Navigation {...this.state.navigation} /> : null }
          { this.state.content ? <Content {...this.state.content} /> : null }
          { this.state.dialog ? <Dialog {...this.state.dialog} /> : null }
        </div>
      </>
    )
  }
}
