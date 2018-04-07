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
  validation?: Validation,
  className?: string,
  tabIndex?: number,
  autoFocus?: boolean,
}

type State = {
  validation: Validation,
  value: string,
}

export class Input extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      // TODO: if necessary, add a thing that ensures only the last
      //       emitted value from the validator can effect the state
      validation: { state: 'empty' },
      value: props.defaultValue || '',
    }
  }

  async handleChange(event: SyntheticEvent<HTMLInputElement>) {
    const { currentTarget: { value } } = event
    const { validator, validation, onChange } = this.props
    onChange(value)
    this.setState({ value })
    if (validator) {
      const validation = await validator(value)
      this.setState({ validation })
    }
  }

  render() {
    const { tabIndex, autoFocus, title, placeholder, type, className, defaultValue, validation: pValidation } = this.props
    const { validation: sValidation, value } = this.state
    const validation = pValidation || sValidation
    return (
      <div className={`${S.container} ${className || ''}`}>
        <input className={S.input} autoFocus={autoFocus} tabIndex={tabIndex} defaultValue={defaultValue || ''} onChange={event => this.handleChange(event)} type={type || 'text'} />
        { title ? <span className={S.title}>{ title || '' }</span> : null }
        { validation.state === 'error' ? <span className={S.errorMessage}>{ validation.message }</span> : null }
        { placeholder && !title && !value ? <span className={S.placeholder}>{ placeholder || '' }</span> : null }
        <div className={S.underline} />
      </div>
    )
  }
}
