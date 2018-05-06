/* @flow */
import * as React from 'react'
import S from './index.css'

function numberToColor(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`
}

function colorToNumber(color: string): number {
  return color.startsWith('#')
    ? parseInt(color.slice(1), 16)
    : parseInt(color, 16)
}

export type Props = {
  className?: string,
  defaultValue?: ?number,
  onChange: (number) => void,
}

type State = {
  color: number,
}

export class ColorPicker extends React.Component<Props, State> {
  // $FlowIgnore
  ref: React.Ref<HTMLInputElement>

  constructor(props: Props) {
    super(props)
    // $FlowIgnore
    this.ref = React.createRef()
    this.state = {
      color: props.defaultValue || 0xffffff,
    }
  }

  handleChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const { currentTarget } = event
    const color = colorToNumber(currentTarget.value)
    this.setState({ color })
    this.props.onChange(color)
  }

  render() {
    const { className, onChange } = this.props
    const { color } = this.state

    return (
      <>
        <div className={`${S.button} ${className || ''}`} onClick={() => this.ref.current && this.ref.current.click()} style={{ backgroundColor: numberToColor(color) }}/>
        <input
          defaultValue={numberToColor(color)}
          type='color'
          className={S.hidden}
          onChange={event => this.handleChange(event)}
          ref={this.ref} />
      </>
    )
  }
}
