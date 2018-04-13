/* @flow */
import * as React from 'react'

import * as API from '../../api'
const { GraphQLQuery } = API
import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import { SignInRequest } from '../../api/sign-in'
import { closeDialog } from '../action'
import { completeSignIn } from '../../update/signin'
import { Form } from '../form'
import { Basic } from '../basic'
import { Input } from '../../common/input'
import { Button } from '../../common/button'
import type { Props as ButtonProps } from '../../common/button'
import type { Response } from '../../api'
import S from '../form.css'

import { Observable } from 'rxjs/Observable'

export type Props = {
  name: 'signin',
}

type State = {
  email: string,
  password: string,
  response: Response<string>
}

export class SignIn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      response: API.unsent,
    }
  }

  trySignIn() {
    const { email: usr, password: psw } = this.state
    new SignInRequest()
      .send({ usr, psw })
      .subscribe(response => 
        this.setState({ response }, () => {
          if (this.state.response.state === 'retrieved') {
            completeSignIn()
          }
        })
      )
  }

  handleEmailChange(email: string) {
    this.setState({ email })
  }

  handlePasswordChange(password: string) {
    this.setState({ password })
  }

  render() {
    const onContinue: ButtonProps = {
      title: l`Sign in`,
      action: () => this.trySignIn(),
      priority: 'primary',
      enabled: this.state.response.state !== 'sending',
    }

    return (
      <Basic title={l`Sign in`} onClose={closeDialog}>
        <Form image={LOGO}>
          <div className={S.question}>
            {l`Welcome back`}
          </div>
          <Input className={S.titledInput} title={l`Email`} key="email" onChange={email => this.handleEmailChange(email)} autoFocus/>
          <Input className={S.titledInput} type="password" title={l`Password`} key="password" onChange={password => this.handlePasswordChange(password)} />
          <Button className={S.button} {...onContinue} />
        </Form>
      </Basic>
    )
  }
}
