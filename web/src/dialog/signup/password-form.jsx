/* @flow */
import * as React from 'react'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { Input } from '../../common/input'
import { Form } from '../form'
import type { Props as FormProps } from '../form'
import type { Validation as InputValidation } from '../../common/input'
import { VALID, EMPTY, INVALID } from '../../model/validation'
import type { FormDelegate as Props } from './index'
import S from '../form.css'

type State = {
  password: string,
  confirmPassword: string,
  passwordValidation: InputValidation,
  mismatchValidation: InputValidation,
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
      passwordValidation: { state: EMPTY },
      mismatchValidation: { state: EMPTY },
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
    let passwordValidation = { state: VALID }
    let mismatchValidation = { state: VALID }
    if (password === '') {
      passwordValidation = { state: EMPTY }
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      passwordValidation = { state: INVALID, error: l`Your password is too short` }
    }
    if (confirmPassword === '') {
      mismatchValidation = { state: EMPTY }
    } else if (password !== confirmPassword) {
      mismatchValidation = { state: INVALID, error: l`Your passwords don't match` }
    }
    this.setState({ passwordValidation, mismatchValidation })
    this.props.onValidate(passwordValidation.state === VALID && mismatchValidation.state === VALID)
  }

  render() {
    const { onSubmit } = this.props
    const { passwordValidation, mismatchValidation } = this.state
    return (
      <Form image={LOGO}>
        <div className={S.question}>
          { l`Pick a password. I'm not looking.` }
        </div>
        <Input className={S.input} type="password" placeholder={l`Password`} onChange={password => this.handlePasswordChange(password)} onSubmit={() => this.confirmInput.current.focus()} validation={passwordValidation} key="password" autoFocus />
        <Input className={S.input} type="password" placeholder={l`And again`} onChange={password => this.handleConfirmPasswordChange(password)} ref={this.confirmInput} onSubmit={onSubmit} validation={mismatchValidation}/>
      </Form>
    )
  }
}
