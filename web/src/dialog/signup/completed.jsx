/* @flow */
import * as React from 'react'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l } from '../../localization'
import * as API from '../../api'
import { SignUpRequest } from '../../api/signup'
import { setUser } from '../../update/signin'
import type { FormDelegate } from './index'
import type { Response } from '../../api'
import type { User } from '../../model/user'

const { Fragment } = React

import S from './completed.css'

export type Props = FormDelegate & {
  account: {|
    name: string,
    email: string,
    password: string,
  |},
}

type State = {
  response: Response<User, string>,
}

export class Completed extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      response: API.unsent,
    }
  }

  componentDidMount() {
    new SignUpRequest()
      .send(this.props.account)
      .subscribe(response => this.setState({ response }, () => {
        if (this.state.response.state === 'retrieved') {
          setUser(this.state.response.value)
        }
        this.props.onValidate(this.state.response.state === 'retrieved')
      }))
  }

  render() {
    let copy: React.Fragment
    let heading: React.Fragment
    switch (this.state.response.state) {
      case 'unsent':
      case 'sending':
        heading = l`Working...`
        copy = null
        break
      case 'retrieved':
        heading = l`... You're in!`
        copy = (
          <Fragment>
            {l`We're glad you joined us.`}<br />
            {l`Let's get started!`}
          </Fragment>
        )
        break
      case 'failed':
        heading = l`Oh no...`
        copy = (
          <Fragment>
            {l`It seems something went wrong.`}<br />
            {l`You'll have to try again later... Sorry for the inconvenience.`}
            {this.state.response.error}
          </Fragment>
        )
        break
    }
    return (
      <div className={S.container}>
        <h1 className={S.heading}>{ heading }</h1>
        <img src={LOGO} className={S.banner} />
        <p className={S.copy}>
          { copy }
        </p>
      </div>
    )
  }
}
