/* @flow */
import * as React from 'react'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { Input } from '../../common/input'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { Form } from './form'
import type { Props as FormProps } from './form'
import type { Validation as InputValidation } from '../../common/input'
import type { FormDelegate as Props } from './index'
import S from './form.css'

type State = {
  email: string,
  confirmEmail: string,
  validation: InputValidation,
}

const EMAIL_FORMAT = /^[^@]+@[^@]+\.[^@]+$/

export class EmailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: '',
      confirmEmail: '',
      validation: { state: 'empty' },
    }
  }

  handleEmailChange(value: string) {
    const { onChange, onValidate } = this.props
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    onChange(trimmed)
    this.validate(trimmed, this.state.confirmEmail)
    this.setState({ email: trimmed })
  }

  handleConfirmEmailChange(value: string) {
    const { onChange, onValidate } = this.props
    const trimmed = value.replace(/(^\s+|\s+$)/g, "")
    this.validate(this.state.email, trimmed)
    this.setState({ confirmEmail: trimmed })
  }

  validate(email: string, confirmEmail: string) {
    if (email === '' || confirmEmail === '') {
      this.setState({ validation: { state: 'empty' }})
      this.props.onValidate(false)
    } else if (!EMAIL_FORMAT.test(email)) {
      this.setState({ validation: { state: 'error', message: l`Your email looks wrong` }})
      this.props.onValidate(false)
    } else if (email !== confirmEmail) {
      this.setState({ validation: { state: 'error', message: l`Your emails don't match` }})
      this.props.onValidate(false)
    } else {
      this.setState({ validation: { state: 'valid' }})
      this.props.onValidate(true)
    }
  }

  render() {
    const { validation } = this.state
    return (
      <Form image={LOGO}>
        <div className={S.question}>
          { l`Can I get your email?` }
          <Tooltip title={l``}>
            <Icon className={S.info} name="info_outline" />
          </Tooltip>
        </div>
        <Input className={S.input} tabIndex={1} placeholder={l`Email`} onChange={email => this.handleEmailChange(email)} />
        <Input className={S.input} tabIndex={2} placeholder={l`And again`} onChange={email => this.handleConfirmEmailChange(email)} />
        <span className={S.hint}>{ l`We won't send you anything.` }<br />{ l`Promise.` }</span>
        { validation.state === 'error' ? <span className={S.error}>{ validation.message }</span> : null }
      </Form>
    )
  }
}

