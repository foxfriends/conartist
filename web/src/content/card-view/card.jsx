/* @flow */
import * as React from 'react'
import { Icon } from '../../common/icon'
import S from './card.css'

export type Props = { 
  className?: string,
  collapsible?: boolean,
  style?: { [string]: string | number },
  children: [React.Node, React.Node],
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
    const { children: [header, content], collapsible, className, style } = this.props
    const { collapsed } = this.state

    return (
      <div className={`${S.card} ${className || ''}`} style={style || {}}>
        <div className={S.header}>
          { header }
          { collapsible 
              ? <div className={S.rightAction} onClick={() => this.handleToggleCollapsed()}>
                  <Icon name={collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}/>
                </div>
              : null
          }
        </div>
        <div className={S.content}>
          { !collapsed || !collapsible ? content : null }
        </div>
      </div>
    )
  }
}
