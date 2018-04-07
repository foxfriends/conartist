/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { Basic } from '../basic'
import { NameForm } from './name-form'
import { EmailForm } from './email-form'
import { progressToNextStep } from '../../update/signup'
import type { Step } from '../../model/dialog/signup'
import type { Props as BasicProps } from '../basic'
import type { Props as FormProps } from './form'
import type { Props as ButtonProps } from '../../common/button'
import type { Props as PagerProps } from '../../common/pager'

export type Props = {
  name: 'signup',
  step: Step,
}

type State = {
  isValid: bool,
  formValue: string,
}

export type FormDelegate = {
  onValidate: (boolean) => void,
  onChange: (string) => void,
}

export class SignUp extends React.Component<Props, State> {
  formDelegate: FormDelegate

  constructor(props: Props) {
    super(props)
    this.state = {
      isValid: false,
      formValue: '',
    }
    this.formDelegate = {
      onValidate: isValid => this.setState({ isValid }),
      onChange: formValue => this.setState({ formValue }),
    }
  }

  handleBack() {
    const { step } = this.props
    this.setState({ isValid: false, formValue: '' })
    progressToNextStep(step.previous())
  }

  handleContinue() {
    const { step } = this.props
    this.setState({ isValid: false, formValue: '' })
    progressToNextStep(step.next(this.state.formValue))
  }

  render() {
    const { step, ...basicProps } = this.props
    const { isValid } = this.state

    let form: React.Node
    let pagerProps: PagerProps = {
      pages: 5,
      page: 0,
    }

    let onBack: ?ButtonProps = {
      title: l`Back`,
      action: () => this.handleBack(),
      priority: 'secondary',
    }

    switch (step.name) {
      case 'name':
        pagerProps.page = 0
        onBack = null
        form = <NameForm {...this.formDelegate} />
        break
      case 'email':
        pagerProps.page = 1
        form = <EmailForm {...this.formDelegate} />
        break
      case 'password':
        pagerProps.page = 2
        break
      case 'terms':
        pagerProps.page = 3
        break
      case 'completed':
        pagerProps.page = 4
        break
    } 

    const onContinue: ButtonProps = {
      title: l`Continue`,
      action: () => this.handleContinue(),
      priority: 'primary',
      enabled: isValid,
    }

    return (
      <Basic title={l`Sign up`} onContinue={onContinue} onBack={onBack} pager={pagerProps}>
        { form }
      </Basic>
    )
  }
}
