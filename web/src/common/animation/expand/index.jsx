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

  componentDidMount() {
    const height = this.measurementDiv.current.clientHeight
    this.setState({ height })
  }

  componentDidUpdate() {
    const height = this.measurementDiv.current.clientHeight
    if(height !== this.state.height) {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer)
      }
      this.animationTimer = setTimeout(
        () => {
          this.animationTimer = null
          this.setState({ previousChildren: null })
        },
        200,
      )
      this.setState({ height })
    }
  }

  render() {
    const { className, children } = this.props
    const { height, previousChildren } = this.state
    const style: { [string]: string | number } = {
      height,
    }

    if (this.animationTimer === null) {
      style.transitionDuration = '0s'
      style.overflow = 'visible'
    }

    return (
      <div className={`${S.expansionContainer} ${className || ''}`} style={style}>
        <div>
          { !height ? previousChildren : null }
        </div>
        <div ref={this.measurementDiv}>
          { children }
        </div>
      </div>
    )
  }
}
