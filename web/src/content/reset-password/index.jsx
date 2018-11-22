/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { ResetPasswordRequest } from '../../api/reset-password'
import { isSignedIn } from '../../util/is-signed-in'
import { showSigninDialog } from '../../update/splash'
import { Input } from '../../common/input'
import { Button } from '../../common/button'
import * as navigate from '../../update/navigate'
import { VALID, EMPTY, INVALID } from '../../model/validation'
import S from './index.css'

export type Props = {
  code: string,
}

const MIN_PASSWORD_LENGTH = 8

type State = {
  password: string,
  confirm: string,
  passwordValidation: InputValidation,
  mismatchValidation: InputValidation,
  processing: ?string,
}

export class ResetPassword extends React.Component<Props, State> {
  // $FlowIgnore: Flow definitions not up to date
  passwordInput: React.Ref<Input>
  // $FlowIgnore: Flow definitions not up to date
  confirmInput: React.Ref<Input>

  constructor(props) {
    super(props)
    this.confirmInput = React.createRef()
    this.passwordInput = React.createRef()
    this.state = {
      password: '',
      confirm: '',
      passwordValidation: { state: EMPTY },
      mismatchValidation: { state: EMPTY },
      processing: null,
    };
  }

  handlePasswordChange(value: string) {
    this.validate(value, this.state.confirm)
    this.setState({ password: value })
  }

  handleConfirmPasswordChange(value: string) {
    this.validate(this.state.password, value)
    this.setState({ confirm: value })
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
  }

  handleSubmit() {
    const { code } = this.props
    const { password } = this.state
    new ResetPasswordRequest().send({ code, password })
      .subscribe(response => {
        this.setState({ processing: response.state })
      })
  }

  render() {
    const { processing, passwordValidation, mismatchValidation } = this.state
    switch (processing) {
      case 'retrieved':
        return (
          <section className={S.container}>
            <h2>{l`Reset Password`}</h2>
            <p>{l`Password changed successfully`}</p>
            <Button
              enabled={passwordValidation.state === VALID && mismatchValidation.state === VALID}
              className={S.button}
              action={showSigninDialog}
              priority='primary'
              >
              {l`Sign in`}
            </Button>
          </section>
        )
      default:
      case null:
        return (
          <section className={S.container}>
            <h2>{l`Reset Password`}</h2>
            <p className={S.error}>{processing === 'failed' ? l`An unknown error has occurred` : null}</p>
            <p>{processing === 'progress' ? l`Working...` : null}</p>
            <div className={S.form}>
              <Input
                className={S.input}
                type='password'
                title={l`New password`}
                onChange={password => this.handlePasswordChange(password)}
                onSubmit={() => this.confirmInput.current && this.confirmInput.current.focus()}
                ref={this.passwordInput}
                validation={passwordValidation}
                autoFocus
                />
              <Input
                className={S.input}
                type='password'
                title={l`Confirm new password`}
                onChange={password => this.handleConfirmPasswordChange(password)}
                ref={this.confirmInput}
                onSubmit={() => this.handleSubmit()}
                validation={mismatchValidation}
                />
            </div>
            <Button
              enabled={passwordValidation.state === VALID && mismatchValidation.state === VALID}
              className={S.button}
              action={() => this.handleSubmit()}
              priority='primary'
              >
              {l`Save`}
            </Button>
          </section>
        )
    }
  }
}
