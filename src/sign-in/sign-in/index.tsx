'use strict';
import * as React from 'react';
import { TextField, FlatButton, RaisedButton } from 'material-ui';

import { If } from '../../react-utils';

import '../../form.scss';

type Props = {};
type State = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  confirmEmail: string;
  passwordMismatch: boolean;
  emailMismatch: boolean;
  signUp: boolean;
};

export default class SignIn extends React.Component<Props, State> {
  state: State = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    confirmEmail: '',
    passwordMismatch: false,
    emailMismatch: false,
    signUp: false,
  };

  private updateUsername(username: string) {
    this.setState({ username });
  }

  private updatePassword(password: string) {
    this.setState({
      password,
      passwordMismatch: password !== '' && password !== (this.state.confirmPassword || password),
    });
  }

  private updateEmail(email: string) {
    this.setState({
      email,
      passwordMismatch: email !== '' && email !== (this.state.confirmEmail || email),
    });
  }

  private checkPassword(password: string) {
    this.setState({
      confirmPassword: password,
      passwordMismatch: password !== '' && password !== (this.state.password || password),
    });
  }

  private checkEmail(email: string) {
    this.setState({
      confirmEmail: email,
      passwordMismatch: email !== '' && email !== (this.state.email || email),
    });
  }

  private logIn() {
    if(this.state.signUp) {
      // TODO: sign up
    } else {
      // TODO: log in
    }
    window.location.href = '/dashboard';
  }

  private toggleSignUp() {
    this.setState({ signUp: !this.state.signUp });
  }

  render() {
    return (
      <div className='form'>
        <h1 className='form__title'>ConArtist</h1>
        <div>
          <TextField
            name='username'
            floatingLabelText='Username'
            onChange={(_, text) => this.updateUsername(text)}
            fullWidth />
          <TextField
            name='password'
            floatingLabelText='Password'
            onChange={(_, text) => this.updatePassword(text)}
            type='password'
            fullWidth />
          <If cond={this.state.signUp}>
            <TextField
              name='confirm-password'
              floatingLabelText='Confirm Password'
              errorText={this.state.passwordMismatch ? 'Passwords do not match' : ''}
              onChange={(_, text) => this.checkPassword(text)}
              type='password'
              fullWidth />
            <TextField
              name='email'
              floatingLabelText='Email'
              onChange={(_, text) => this.updateEmail(text)}
              type='email'
              fullWidth />
            <TextField
              name='confirm-email'
              floatingLabelText='Confirm Email'
              errorText={this.state.emailMismatch ? 'Emails do not match' : ''}
              onChange={(_, text) => this.checkEmail(text)}
              type='email'
              fullWidth />
          </If>
          <div style={{ margin: 4 }}>
            <RaisedButton fullWidth primary label={this.state.signUp ? 'Create Account' : 'Sign In'} onTouchTap={() => this.logIn()} style={{ margin: '4px 0' }}/>
            <FlatButton fullWidth primary label={this.state.signUp ? 'Cancel' : 'Sign Up'} onTouchTap={() => this.toggleSignUp()} style={{ margin: '4px 0' }}/>
          </div>
        </div>
      </div>
    );
  }
}
