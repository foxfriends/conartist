/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props<E: React.ElementType> = {
  className?: string,
  children?: ?React.Element<E>,
}

type State<E: React.ElementType> = {
  height: number,
  previousChildren: ?React.Element<E>,
  children: ?React.Element<E>,
}

export class Expand<E: React.ElementType> extends React.Component<Props<E>, State<E>> {
  static getDerivedStateFromProps({ children }: Props<E>, state: State<E>) {
    return {
      previousChildren: state.children,
      children: children ? React.cloneElement(children) : null,
    }
  }

  // $FlowIgnore
  measurementDiv: React.Ref<HTMLDivElement>
  animationTimer: ?TimeoutID

  constructor(props: Props<E>) {
    super(props)
    this.animationTimer = null
    this.state = {
      height: 0,
      previousChildren: null,
      children: props.children ? React.cloneElement(props.children) : null,
    }
    // $FlowIgnore
    this.measurementDiv = React.createRef()
  }

  componentWillUnmount() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer)
    }
  }

  shouldComponentUpdate(props: Props<E>, state: State<E>): boolean {
    return state.previousChildren !== this.state.previousChildren || state.height !== this.state.height || props.children !== this.props.children
  }

  componentDidUpdate() {
    const height = this.measurementDiv.current.clientHeight
    this.setState({ height }, () => {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer)
      }
      this.animationTimer = setTimeout(
        () => {
          this.setState({ previousChildren: null })
          this.animationTimer = null
        },
        200,
      )
    })
  }

  render() {
    const { className, children } = this.props
    const { height, previousChildren } = this.state
    return (
      <div className={`${S.expansionContainer} ${className || ''}`} style={{ height }}>
        <div>
          { previousChildren }
        </div>
        <div ref={this.measurementDiv}>
          { children }
        </div>
      </div>
    )
  }
}
