/* @flow */
import * as React from 'react'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { Input } from '../../common/input'
import { Tooltip } from '../../common/tooltip'
import { Form } from '../form'
import type { Props as FormProps } from '../form'
import type { Validation as InputValidation } from '../../common/input'
import type { FormDelegate as Props } from './index'
import S from '../form.css'

type State = {
  password: string,
  confirmPassword: string,
  validation: InputValidation,
}

const MIN_PASSWORD_LENGTH = 8

export class PasswordForm extends React.Component<Props, State> {
  // $FlowIgnore: Flow definitions not up to date
  confirmInput: React.Ref<Input>

  constructor(props: Props) {
    super(props)
    // $FlowIgnore: Flow definitions not up to date
    this.confirmInput = React.createRef()
    this.state = {
      password: '',
      confirmPassword: '',
      validation: { state: 'empty' },
    }
  }

  handlePasswordChange(value: string) {
    const { onChange, onValidate } = this.props
    onChange(value)
    this.validate(value, this.state.confirmPassword)
    this.setState({ password: value })
  }

  handleConfirmPasswordChange(value: string) {
    const { onChange, onValidate } = this.props
    this.validate(this.state.password, value)
    this.setState({ confirmPassword: value })
  }

  validate(password: string, confirmPassword: string) {
    if (password === '' || confirmPassword === '') {
      this.setState({ validation: { state: 'empty' }})
      this.props.onValidate(false)
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      this.setState({ validation: { state: 'error', message: l`Your password is too short` }})
      this.props.onValidate(false)
    } else if (password !== confirmPassword) {
      this.setState({ validation: { state: 'error', message: l`Your passwords don't match` }})
      this.props.onValidate(false)
    } else {
      this.setState({ validation: { state: 'valid' }})
      this.props.onValidate(true)
    }
  }

  render() {
    const { onSubmit } = this.props
    const { validation } = this.state
    return (
      <Form image={LOGO}>
        <div className={S.question}>
          { l`Pick a password. I'm not looking.` }
        </div>
        <Input className={S.input} type="password" placeholder={l`Password`} onChange={password => this.handlePasswordChange(password)} onSubmit={() => this.confirmInput.current.focus()} key="password" autoFocus />
        <Input className={S.input} type="password" placeholder={l`And again`} onChange={password => this.handleConfirmPasswordChange(password)} ref={this.confirmInput} onSubmit={onSubmit} />
        { validation.state === 'error' ? <span className={S.error}>{ validation.message }</span> : null }
      </Form>
    )
  }
}

