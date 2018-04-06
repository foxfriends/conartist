/* @flow */
import * as React from 'react'
import { l } from '../../localization'
import { Basic } from '../basic'
import { NameForm } from './name-form'
import { progressToNextStep } from '../../update/signup'
import type { Step } from '../../model/dialog/signup'
import type { Props as BasicProps } from '../basic'
import type { Props as FormProps } from './form'
import type { Props as ButtonProps } from '../../common/button'
export type Props = BasicProps & {
  name: 'signup',
  step: Step,
}

type State = {
  isValid: bool,
  formValue: string,
}

export class SignUp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isValid: false,
      formValue: '',
    }
  }

  onContinue() {
    const { step } = this.props
    progressToNextStep(step.next(this.state.formValue))
  }

  render() {
    const { step, ...basicProps } = this.props
    const { isValid } = this.state
    const formProps: FormProps = {
      onValidate: isValid => this.setState({ isValid }),
      onChange: formValue => this.setState({ formValue }),
    }
    let form: React.Node
    switch (step.name) {
      case 'name':
        form = <NameForm {...formProps} />
        break
      case 'email':
        break
      case 'password':
        break
      case 'terms':
        break
    } 

    const onContinue: ButtonProps = {
      title: l`Continue`,
      action: () => this.onContinue(),
      priority: 'primary',
    }

    return (
      <Basic onContinue={onContinue} {...(basicProps: BasicProps)}>
        { form }
      </Basic>
    )
  }
}
