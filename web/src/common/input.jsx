/* @flow */
import * as React from 'react'

import S from './input.css'

export type Validation = { state: 'valid' } | { state: 'empty' } | { state: 'error', message: string }

export type Validator = ((string) => Validation) | ((string) => Promise<Validation>)

export type Props = {
  type?: 'text' | 'password' | 'email',
  title?: string,
  placeholder?: string,
  defaultValue?: string,
  onChange: (string) => void,
  validator?: Validator,
  className?: string,
}

type State = {
  error: ?string,
  value: string,
}

export class Input extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      // TODO: if necessary, add a thing that ensures only the last
      //       emitted value from the validator can effect the state
      error: null,
      value: props.defaultValue || '',
    }
  }

  async handleChange(event: SyntheticEvent<HTMLInputElement>) {
    const { currentTarget: { value } } = event
    const { validator, onChange } = this.props
    onChange(value)
    this.setState({ value })
    if (validator) {
      const validation = await validator(value)
      if (validation.state === 'error') {
        this.setState({ error: validation.message })
      } else {
        this.setState({ error: null })
      }
    }
  }

  render() {
    const { title, placeholder, type, className, defaultValue } = this.props
    const { error, value } = this.state
    return (
      <div className={`${S.container} ${className || ''}`}>
        <input className={S.input} defaultValue={defaultValue || ''} onChange={event => this.handleChange(event)} type={type || 'text'} />
        { title ? <span className={S.title}>{ title || '' }</span> : null }
        { placeholder && !title && !value ? <span className={S.placeholder}>{ placeholder || '' }</span> : null }
        <div className={`${S.underline} ${error ? S.error : ''}`} />
        { error ? <span className={S.errorMessage}>{ error }</span> : null }
      </div>
    )
  }
}
