/* @flow */
import * as React from 'react'
import { Icon } from '../../common/icon'
import { Card } from './card'
import S from './basic-card.css'
const { Fragment } = React

export type Props = { 
  collapsible?: boolean,
  title?: React.Node,
  children?: React.Node,
}

type State = {
  collapsed: boolean,
}

export class BasicCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }

  handleToggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { children, title, collapsible } = this.props
    const { collapsed } = this.state

    return (
      <Card>
        <Fragment>
          { title ? <div className={S.title}>{ title }</div> : null }
          { collapsible 
            ? <div className={S.rightAction} onClick={() => this.handleToggleCollapsed()}>
                <Icon name={collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}/>
              </div>
            : null
          }
        </Fragment>
        <Fragment>
          { !(collapsed && collapsible) ? children : null }
        </Fragment>
      </Card>
    )
  }
}
