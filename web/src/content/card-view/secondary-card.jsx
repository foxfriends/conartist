/* @flow */
import * as React from 'react'

import { BasicHeader } from './basic-header'
import { IconButton } from '../../common/icon-button'
import S from './secondary-card.css'

export type Props = {
  title: string,
  // $FlowIgnore
  anchor: React.Ref<HTMLElement>,
  children: React.Node,
  onClose?: () => void,
}

type State = {
  top: number,
}

// NOTE: this is a bit sketchy, but it will do for now...
export class SecondaryCard extends React.Component<Props, State> {
  // $FlowIgnore
  ref: React.Ref<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    // $FlowIgnore
    this.ref = React.createRef()
    this.state = {
      top: 0,
    }
  }

  shouldComponentUpdate(props: Props, state: State) {
    return this.state.top !== state.top
  }

  componentDidUpdate() {
    if (this.ref.current && this.props.anchor.current) {
      const cardView = document.querySelector('#card-view')
      if (!cardView) { throw new Error('There is no #card-view element!') }
      // $FlowIgnore
      const height = this.ref.current.clientHeight
      let node = this.props.anchor.current
      let top = 0
      while (node && node !== cardView) {
        top += node.offsetTop
        node = node.offsetParent
      }
      if (top + height + 16 > cardView.offsetHeight - 16) {
        top = cardView.offsetHeight - height - 16
      }

      this.setState({ top: top - 16 })
    }
  }

  componentDidMount() {
    this.componentDidUpdate()
  }

  render() {
    const { title, children, anchor, onClose } = this.props
    const { top } = this.state

    return (
      // $FlowIgnore
      <div className={S.card} style={{ top }} ref={this.ref}>
        <div className={S.header}>
          <BasicHeader>
            { title }
          </BasicHeader>
          { onClose ? <IconButton quiet className={S.rightAction} action={onClose} title='close' priority='secondary'/> : null }
        </div>
        <div className={S.content}>
          { children }
        </div>
      </div>
    )
  }
}
