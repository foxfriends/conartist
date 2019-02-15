/* @flow */
import * as React from 'react'
import { Observable } from 'rxjs'

import * as API from '../../api'
const { GraphQLQuery } = API
import IMAGE from '../../../images/sign-in.png'
import { l } from '../../localization'
import { SignInRequest } from '../../api/signin'
import { closeDialog } from '../action'
import { completeSignIn } from '../../update/signin'
import { showResetPasswordDialog } from '../../update/dialog'
import { Form } from '../form'
import { Basic } from '../basic'
import { Input } from '../../common/input'
import { Link } from '../../common/link'
import { Button } from '../../common/button'
import { Icon } from '../../common/icon'
import { Tooltip } from '../../common/tooltip'
import { VALID, INVALID } from '../../model/validation'
import type { Props as ButtonProps } from '../../common/button'
import type { Response } from '../../api'
import type { User } from '../../model/user'
import type { Validation as InputValidation } from '../../common/input'
import S from '../form.css'
import SS from './index.css'

export type Props = {
  name: 'signin',
}

type State = {
  email: string,
  password: string,
  response: Response<User, string>,
  passwordValidation: InputValidation,
}

export class SignIn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      response: API.unsent,
      passwordValidation: { state: VALID },
    }
  }

  trySignIn() {
    const { email: usr, password: psw } = this.state
    new SignInRequest()
      .send({ usr, psw })
      .subscribe(response => {
        if (response.state === 'failed') {
          this.setState({ passwordValidation: { state: INVALID, error: l`Your password is incorrect` } })
        }
        this.setState({ response }, () => {
          if (this.state.response.state === 'retrieved') {
            completeSignIn(this.state.response.value)
          }
        })
      })
  }

  handleEmailChange(email: string) {
    this.setState({ email, passwordValidation: { state: VALID } })
  }

  handlePasswordChange(password: string) {
    this.setState({ password, passwordValidation: { state: VALID } })
  }

  render() {
    const { email, response, passwordValidation } = this.state

    const onContinue: ButtonProps = {
      title: l`Sign in`,
      action: () => this.trySignIn(),
      priority: 'primary',
      enabled: response.state !== 'sending',
    }

    return (
      <Basic title={l`Sign in`} onClose={closeDialog}>
        <Form image={IMAGE} imageWidth={200} containerClassName={SS.padded} className={SS.form}>
          <div className={S.question}>
            {l`Welcome back`}
          </div>
          <Input className={S.titledInput} title={l`Email`} key="email" onChange={email => this.handleEmailChange(email)} autoFocus/>
          <Input className={S.titledInput} enabled={response.state !== 'sending'} type="password" title={l`Password`} key="password" onChange={password => this.handlePasswordChange(password)} onSubmit={() => this.trySignIn()}/>
          <div className={SS.signInFooter}>
            { passwordValidation.state === INVALID
                ? <div className={SS.spacing}><Tooltip title={passwordValidation.error}><Icon name='error' className={SS.error}/></Tooltip></div>
                : <div className={SS.spacing} />
            }
            <Button className={SS.button} {...onContinue} />
            <div className={SS.spacing} />
          </div>
          <Link className={SS.forgotPassword} onClick={() => showResetPasswordDialog(email)}>{l`I forgot my password`}</Link>
        </Form>
      </Basic>
    )
  }
}

export default SignIn
