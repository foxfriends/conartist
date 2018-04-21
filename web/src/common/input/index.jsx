/* @flow */
import * as React from 'react'

import { Tooltip } from '../tooltip'
import { Icon } from '../icon'
import { INVALID, VALID, EMPTY } from '../../model/validation'
import type { Validation as GenericValidation } from '../../model/validation'

import S from './index.css'

export type Validation = GenericValidation<String>

export type Validator = ((string) => Validation) | ((string) => Promise<Validation>)

export type Props = {
  type?: 'text' | 'password' | 'email',
  title?: string,
  placeholder?: string,
  defaultValue?: string,
  onChange?: (string) => void,
  onSubmit?: (string) => void,
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
  // $FlowIgnore: Flow definitions not up to date
  inputElement: React.Ref<HTMLInputElement>

  constructor(props: Props) {
    super(props)
    // $FlowIgnore: Flow definitions not up to date
    this.inputElement = React.createRef()
    this.state = {
      // TODO: if necessary, add a thing that ensures only the last
      //       emitted value from the validator can effect the state
      validation: { state: EMPTY },
      value: props.defaultValue || '',
    }
  }

  focus() {
    this.inputElement.current.focus()
  }

  handleKeyDown(event: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.state.value)
      }
    }
  }

  async handleChange(event: SyntheticEvent<HTMLInputElement>) {
    const { currentTarget: { value } } = event
    const { validator, validation, onChange } = this.props
    if (onChange) {
      onChange(value)
    }
    this.setState({ value })
    if (validator) {
      const validation = await validator(value)
      this.setState({ validation })
    }
  }

  render() {
    const { tabIndex, autoFocus, title, placeholder, type, className, defaultValue, validation: propsValidation } = this.props
    const { validation: stateValidation, value } = this.state
    const validation = propsValidation || stateValidation
    return (
      <div className={`${S.container} ${className || ''}`}>
        <input className={`${S.input} ${value === '' ? S.empty : ''}`} autoFocus={autoFocus} tabIndex={tabIndex} defaultValue={defaultValue || ''} onChange={event => this.handleChange(event)} type={type || 'text'} onKeyDown={event => this.handleKeyDown(event)} ref={this.inputElement} />
        { title ? <span className={S.title}>{ title || '' }</span> : null }
        { value !== '' && validation.state === INVALID
          ? <Tooltip title={validation.error} className={S.error}>
              <Icon name="error" className={S.errorIcon}/>
            </Tooltip>
          : null }
        { placeholder && !title && !value ? <span className={S.placeholder}>{ placeholder || '' }</span> : null }
        <div className={S.underline} />
      </div>
    )
  }
}
