/* @flow */
import * as React from 'react'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { combineLatest } from 'rxjs/observable/combineLatest'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { skip, switchMap } from 'rxjs/operators'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { Input } from '../../common/input'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { Form } from '../form'
import { EmailInUseRequest } from '../../api/email-in-use'
import { EMPTY, VALID, INVALID } from '../../model/validation'
import type { Props as FormProps } from '../form'
import type { Validation as InputValidation } from '../../common/input'
import type { FormDelegate as Props } from './index'
import S from '../form.css'

type State = {
  email: string,
  confirmEmail: string,
  validation: InputValidation,
}

const EMAIL_FORMAT = /^[^@]+@[^@]+\.[^@]+$/

export class EmailForm extends React.Component<Props, State> {
  // $FlowIgnore: Flow definitions not up to date
  confirmInput: React.Ref<Input>
  email: BehaviorSubject<string>
  confirmEmail: BehaviorSubject<string>

  emailInUse: EmailInUseRequest

  constructor(props: Props) {
    super(props)
    // $FlowIgnore: Flow definitions not up to date
    this.confirmInput = React.createRef()
    this.email = new BehaviorSubject('')
    this.confirmEmail = new BehaviorSubject('')
    this.emailInUse = new EmailInUseRequest()
    this.state = {
      email: '',
      confirmEmail: '',
      validation: { state: EMPTY },
    }

    this.email
      .pipe(skip(1))
      .subscribe(email => this.setState({ email }))
    this.confirmEmail
      .pipe(skip(1))
      .subscribe(confirmEmail => this.setState({ confirmEmail }))

    combineLatest(this.email, this.confirmEmail)
      .pipe(
        skip(1),
        switchMap(([email, confirmEmail]) => fromPromise(this.validate(email, confirmEmail))),
      )
      .subscribe(validation => this.setState({ validation }, () => {
        this.props.onValidate(this.state.validation.state === VALID)
      }))
  }

  componentWillUnmount() {
    this.email.complete()
    this.confirmEmail.complete()
  }

  handleEmailChange(value: string) {
    const { onChange, onValidate } = this.props
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    onChange(trimmed)
    this.email.next(trimmed)
  }

  handleConfirmEmailChange(value: string) {
    const { onChange, onValidate } = this.props
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    this.confirmEmail.next(trimmed)
  }

  async validate(email: string, confirmEmail: string): Promise<InputValidation> {
    if (email !== '' && (await this.emailInUse.send(email).toPromise()).value) {
      return { state: INVALID, error: l`That email is already being used` }
    } else if (email === '' || confirmEmail === '') {
      return { state: EMPTY }
    } else if (!EMAIL_FORMAT.test(email)) {
      return { state: INVALID, error: l`Your email looks wrong` }
    } else if (email !== confirmEmail) {
      return { state: INVALID, error: l`Your emails don't match` }
    } else {
      return { state: VALID }
    }
  }

  render() {
    const { onSubmit } = this.props
    const { validation } = this.state
    return (
      <Form image={LOGO}>
        <div className={S.question}>
          { l`Can I get your email?` }
          <Tooltip title={l``}>
            <Icon className={S.info} name="info_outline" />
          </Tooltip>
        </div>
        <Input className={S.input} placeholder={l`Email`} onChange={email => this.handleEmailChange(email)} onSubmit={() => this.confirmInput.current.focus()} key="email" autoFocus />
        <Input className={S.input} placeholder={l`And again`} onChange={email => this.handleConfirmEmailChange(email)} ref={this.confirmInput} onSubmit={onSubmit} />
        <span className={S.hint}>{ l`We won't send you anything.` }<br />{ l`Promise.` }</span>
        { validation.state === INVALID ? <span className={S.error}>{ validation.error }</span> : null }
      </Form>
    )
  }
}
