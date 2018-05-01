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
    const titleStyle = {
      gridColumnStart: 1,
      gridColumnEnd: `span ${1 + (!value ? 1 : 0)}`,
      gridRowEnd: `span ${rows}`,
    }
    const valueStyle = {
      gridColumnStart: title ? 2 : 1,
      gridColumnEnd: `span ${1 + (!detail ? 1 : 0) + (!title ? 1 : 0)}`,
      gridRowEnd: `span ${rows}`,
    }
    const detailStyle = {
      gridColumnStart: (title || value ? 3 : 1),
      gridColumnEnd: 4 - (title ? 0 : 0) + (value ? 1 : 0),
      gridRowEnd: `span ${rows}`,
    }
    return (
      <Fragment>
        { title ? <div className={`${S.title}`} style={titleStyle}>{ title }</div> : null }
        { value ? <div className={S.value} style={valueStyle}><div ref={this.valueRef}>{ value }</div></div> : null }
        { detail ? <div className={`${S.detail}`} style={detailStyle}>{ detail }</div> : null }
      </Fragment>
    )
  }
}
