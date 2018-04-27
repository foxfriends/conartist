/* @flow */
import * as React from 'react'
import S from './row.css'
const { Fragment } = React

export type Props = {
  title?: React.Node,
  value?: React.Node,
  detail?: React.Node,
}

type State = {
  height: number,
}

export class Row extends React.PureComponent<Props, State> {
  // $FlowIgnore
  valueRef: React.Ref<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.state = {
      height: 0,
    }
    this.valueRef = React.createRef()
  }

  componentDidMount() {
    if (this.valueRef.current) {
      // $FlowIgnore
      const height = this.valueRef.current.clientHeight
      this.setState({ height })
    }
  }

  componentDidUpdate() {
    if (this.valueRef.current) {
      // $FlowIgnore
      const height = this.valueRef.current.clientHeight
      this.setState({ height })
    }
  }

  render() {
    const { title, value, detail } = this.props
    const { height } = this.state
    const rows = Math.ceil(height / 50)
    return (
      <Fragment>
        { title ? <div className={`${S.title}`}>{ title }</div> : <span/>}
        { value ? <div style={{ gridRowEnd: `span ${rows}` }} className={`${S.value} ${detail ? '' : S.valueDetail}`}><div ref={this.valueRef}>{ value }</div></div> : <span/> }
        { detail ? <div className={`${S.detail}`}>{ detail }</div> : null }
        { rows > 1 ? <div style={{ gridRowEnd: `span ${rows - 1}`}} /> : null }
      </Fragment>
    )
  }
}
