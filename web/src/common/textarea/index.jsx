/* @flow */
import * as React from 'react'

export type Props = {
  defaultValue?: string,
  onChange: (string) => void,
}

type State = {
  value: string,
}

export class Textarea extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.defaultValue || ''
    }
  }

  handleChange(event: SyntheticEvent<HTMLTextAreaElement>) {
    const { value } = event.currentTarget
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    const { defaultValue } = this.props
    return (
      <textarea defaultValue={defaultValue} onChange={event => this.handleChange(event)} />
    )
  }
}
