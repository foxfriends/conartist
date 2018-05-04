/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props<E: React.ElementType> = {
  className?: string,
  children?: ?React.Element<E>,
}

type State<E: React.ElementType> = {
  previousChildren: ?React.Element<E>,
  children: ?React.Element<E>,
  key: boolean,
}

export class Fade<E: React.ElementType> extends React.Component<Props<E>, State<E>> {
  static getDerivedStateFromProps({ children }: Props<E>, state: State<E>) {
    return {
      previousChildren: state.children,
      children: children ? React.cloneElement(children) : null,
      key: !state.key,
    }
  }

  animationTimer: ?TimeoutID

  constructor(props: Props<E>) {
    super(props)
    this.animationTimer = null
    this.state = {
      previousChildren: null,
      children: props.children ? React.cloneElement(props.children) : null,
      key: false,
    }
  }

  componentWillUnmount() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer)
    }
  }

  componentDidUpdate() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer)
    }
    this.animationTimer = setTimeout(() => {
      this.setState({ previousChildren: null })
      this.animationTimer = null
    }, 200)
  }

  render() {
    const { className, children } = this.props
    const { previousChildren, key } = this.state

    return (
      <div className={`${S.container} ${className || ''}`}>
        <div className={`${S.fade} ${S.visible}`} key={`fade_${key ? 'b' : 'a'}`}>
          { children }
        </div>
        <div className={`${S.fade}`} key={`fade_${key ? 'a' : 'b'}`}>
          { previousChildren }
        </div>
      </div>
    )
  }
}
