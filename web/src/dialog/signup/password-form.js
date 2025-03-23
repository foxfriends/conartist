/*       */
import * as React from 'react'

import IMAGE from '../../../images/password.png'
import { l } from '../../localization'
import { Input } from '../../common/input'
import { Form } from '../form'
import { VALID, EMPTY, INVALID } from '../../model/validation'
import { MIN_PASSWORD_LENGTH } from '../../constants'
                                                 
                                                                       
                                                    
import S from '../form.css'

              
                   
                          
                                      
                                      
 

export class PasswordForm extends React.Component               {
  // $FlowIgnore: Flow definitions not up to date
  confirmInput                  

  constructor(props       ) {
    super(props)
    this.confirmInput = React.createRef()
    this.state = {
      password: '',
      confirmPassword: '',
      passwordValidation: { state: EMPTY },
      mismatchValidation: { state: EMPTY },
    }
  }

  handlePasswordChange(value        ) {
    const { onChange, onValidate } = this.props
    onChange(value)
    this.validate(value, this.state.confirmPassword)
    this.setState({ password: value })
  }

  handleConfirmPasswordChange(value        ) {
    const { onChange, onValidate } = this.props
    this.validate(this.state.password, value)
    this.setState({ confirmPassword: value })
  }

  validate(password        , confirmPassword        ) {
    let passwordValidation = { state: VALID }
    let mismatchValidation = { state: VALID }
    if (password === '') {
      passwordValidation = { state: EMPTY }
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      passwordValidation = { state: INVALID, error: l`Your password is too short` }
    }
    if (confirmPassword === '') {
      mismatchValidation = { state: EMPTY }
    } else if (password !== confirmPassword) {
      mismatchValidation = { state: INVALID, error: l`Your passwords don't match` }
    }
    this.setState({ passwordValidation, mismatchValidation })
    this.props.onValidate(passwordValidation.state === VALID && mismatchValidation.state === VALID)
  }

  render() {
    const { onSubmit } = this.props
    const { passwordValidation, mismatchValidation } = this.state
    return (
      <Form image={IMAGE} imageWidth={200}>
        <div className={S.question}>
          { l`Pick a password. I'm not looking.` }
        </div>
        {/* $FlowIgnore: Flow definitions not up to date */}
        <Input className={S.input} type="password" placeholder={l`Password`} onChange={password => this.handlePasswordChange(password)} onSubmit={() => this.confirmInput.current && this.confirmInput.current.focus()} validation={passwordValidation} key="password" autoFocus />
        <Input className={S.input} type="password" placeholder={l`And again`} onChange={password => this.handleConfirmPasswordChange(password)} ref={this.confirmInput} onSubmit={onSubmit} validation={mismatchValidation}/>
      </Form>
    )
  }
}
