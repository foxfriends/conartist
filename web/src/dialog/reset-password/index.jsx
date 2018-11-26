/* @flow */
import * as React from 'react'
import { Observable } from 'rxjs'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { RequestResetPasswordRequest } from '../../api/request-reset-password'
import { closeDialog } from '../action'
import { showResetPasswordDialog } from '../../update/dialog'
import { Form } from '../form'
import { Basic } from '../basic'
import { Input } from '../../common/input'
import { Button } from '../../common/button'
import { EMAIL_FORMAT } from '../../constants'
import S from '../form.css'
import SS from './index.css'
const { Fragment } = React

export type Props = {
  name: 'reset-password',
  email: string,
}

type State = {
  email: string,
  submitted: boolean,
}

export class ResetPassword extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: props.email || '',
      submitted: false,
    }
  }

  submitReset() {
    const { email } = this.state
    new RequestResetPasswordRequest().send(email).subscribe()
    this.setState({ submitted: true })
  }

  render() {
    const { email, submitted } = this.state

    return (
      <Basic title={l`Forgot Password`} onClose={closeDialog}>
        <Form image={LOGO}>
          { submitted
            ? l`An email has been sent with your reset password link.`
            : <Fragment>
                <Input
                  defaultValue={email}
                  className={S.titledInput}
                  title={l`Email`}
                  key='email'
                  onChange={email => this.setState({ email })}
                  onSubmit={() => EMAIL_FORMAT.test(email) && this.submitReset()}
                  autoFocus
                  />
                <Button className={SS.button} action={() => this.submitReset()} priority='primary' enabled={EMAIL_FORMAT.test(email)}>
                  {l`Reset`}
                </Button>
              </Fragment>
          }
        </Form>
      </Basic>
    )
  }
}

export default ResetPassword
