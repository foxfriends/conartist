/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { VerifyAccountRequest } from '../../api/verify-account'
import { isSignedIn } from '../../util/is-signed-in'
import { showSigninDialog } from '../../update/splash'
import { Button } from '../../common/button'
import * as navigate from '../../update/navigate'
import S from './index.css'
const { Fragment } = React

export type Props = {
  code: string,
}

type State = {
  success?: boolean,
}

export class Verify extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidMount() {
    const { code } = this.props
    new VerifyAccountRequest().send(code)
      .subscribe(response => {
        switch (response.state) {
          case 'retrieved':
            this.setState({ success: response.data })
            break
          case 'failed':
            this.setState({ success: false })
            break
          default: break
        }
      })
  }

  render() {
    const { className, style, code } = this.props
    const { success } = this.state
    return (
      <section className={S.container}>
        { success === undefined
          ? <h2>{l`Verifying your account...`}</h2>
          : success
            ? <Fragment>
                <h2>{l`Looks good to me`}</h2>
                <p>{l`<Verify Account Successful>`}</p>
                { isSignedIn()
                  ? <Button title={l`Continue`} action={navigate.dashboard} priority='primary' />
                  : <Button title={l`Sign in`} action={showSigninDialog} priority='primary' />
                }
              </Fragment>
            : <Fragment>
                <h2>{l`Oh no...`}</h2>
                <p>{l`<Verify Account Failed>`}</p>
              </Fragment>
        }
      </section>
    )
  }
}
