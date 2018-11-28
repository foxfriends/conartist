/* @flow */
import * as React from 'react'
import S from './index.css'

export type Props = {
  className?: string,
  defaultValue?: string,
  placeholder?: string,
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
    const { defaultValue, className, placeholder } = this.props
    return (
      // $FlowIgnore
      <textarea className={`${S.textarea} ${className || ''}`} placeholder={placeholder} defaultValue={defaultValue} onChange={event => this.handleChange(event)}/>
    )
  }
}
