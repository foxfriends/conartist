/* @flow */
import * as React from 'react'

import { l } from '../../localization'
import { Input } from '../../common/input'
import { Button } from '../../common/button'
import { Icon } from '../../common/icon'
import { Basic } from '../basic'
import { ChangeEmail as ChangeEmailMutation } from '../../api/change-email'
import { EmailInUseRequest } from '../../api/email-in-use'
import { closeDialog as closeDialogButton } from '../action'
import { closeDialog } from '../../update/dialog'
import * as toast from '../../toast'
import { VALID, EMPTY, INVALID } from '../../model/validation'
import { EMAIL_FORMAT } from '../../constants'
import type { Validation as InputValidation } from '../../common/input'
import S from './index.css'

export type Props = {
  name: 'change-email',
}

type State = {
  email: string,
  confirmEmail: string,
  processing: boolean,
  emailValidation: InputValidation,
  mismatchValidation: InputValidation,
}

export class ChangeEmail extends React.Component<Props, State> {
  // $FlowIgnore: Flow definitions not up to date
  emailInput: React.Ref<Input>
  // $FlowIgnore: Flow definitions not up to date
  confirmInput: React.Ref<Input>
  emailInUse: EmailInUseRequest

  constructor(props: Props) {
    super(props)
    this.confirmInput = React.createRef()
    this.emailInput = React.createRef()
    this.emailInUse = new EmailInUseRequest()
    this.state = {
      email: '',
      confirmEmail: '',
      processing: false,
      emailValidation: { state: EMPTY },
      mismatchValidation: { state: EMPTY },
    }
  }

  async handleEmailChange(value: string) {
    this.setState(await this.validate(value, this.state.confirmEmail));
    this.setState({ email: value })
  }

  async handleConfirmEmailChange(value: string) {
    this.setState({ confirmEmail: value })
    this.setState(await this.validate(this.state.email, value));
  }

  async validate(email: string, confirmEmail: string): Promise<{ emailValidation: InputValidation, mismatchValidation: InputValidation }> {
    let emailValidation = { state: VALID }
    let mismatchValidation = { state: VALID }
    if (email !== '' && (await this.emailInUse.send(email).toPromise()).value) {
      emailValidation = { state: INVALID, error: l`That email is already being used` }
    } else if (email === '') {
      emailValidation = { state: EMPTY }
    } else if (!EMAIL_FORMAT.test(email)) {
      emailValidation = { state: INVALID, error: l`Your email looks wrong` }
    }
    if (confirmEmail === '') {
      mismatchValidation = { state: EMPTY }
    } else if (email !== confirmEmail) {
      mismatchValidation = { state: INVALID, error: l`Your emails don't match` }
    }
    return { emailValidation, mismatchValidation }
  }

  async saveChanges() {
    const { emailValidation, mismatchValidation, email, processing } = this.state
    if (emailValidation.state !== VALID || mismatchValidation.state !== VALID || processing) {
      return
    }
    this.setState({ processing: true })
    const response = await new ChangeEmailMutation().send({ email }).toPromise()
    this.setState({ processing: false })
    toast.show(<span>{l`Verification email sent`} <Icon name='check'/></span>)
    closeDialog()
  }

  render() {
    const { emailValidation, mismatchValidation, processing } = this.state
    const save = {
      enabled: emailValidation.state === VALID && mismatchValidation.state === VALID && !processing,
      title: 'Save',
      action: () => this.saveChanges(),
    }
    return (
      <Basic title={l`Change Email`} onClose={closeDialogButton} onContinue={save}>
        <div className={S.form}>
          {/* $FlowIgnore: Flow definitions not up to date */}
          <Input
            className={S.input}
            title={l`New email`}
            onChange={email => this.handleEmailChange(email)}
            onSubmit={() => this.confirmInput.current && this.confirmInput.current.focus()}
            ref={this.emailInput}
            validation={emailValidation}
            />
          <Input
            className={S.input}
            title={l`Confirm new email`}
            onChange={email => this.handleConfirmEmailChange(email)}
            ref={this.confirmInput}
            onSubmit={() => { this.saveChanges() }}
            validation={mismatchValidation}
            />
        </div>
      </Basic>
    )
  }
}

export default ChangeEmail
