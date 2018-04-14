/* @flow */
import * as React from 'react'
import { Icon } from '../../common/icon'
import S from './card.css'

export type Props = { 
  collapsible?: boolean,
  title?: React.Node,
  children?: React.Node,
}

type State = {
  collapsed: boolean,
}

export class Card extends React.Component<Props, State> {
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
      <div className={S.card}>
        <div className={S.header}>
          { title ? <div className={S.title}>{ title }</div> : null }
          { collapsible 
            ? <div className={S.rightAction} onClick={() => this.handleToggleCollapsed()}>
                <Icon name={collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}/>
              </div>
            : null
          }
        </div>
        <div className={S.content}>
          { !(collapsed && collapsible) ? children : null }
        </div>
      </div>
    )
  }
}

