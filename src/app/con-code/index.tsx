'use strict';
import * as React from 'react';
import { TextField, RaisedButton } from 'material-ui';
import Sales from '../sales';

import { get } from '../../request';

import '../../form.scss';

type Props = {};
type State = {
  code: string;
  title: string;
  error: string;
};

export default class ConCode extends React.Component<Props, State> {
  state: State = { code: '', title: '', error: '' };

  componentWillMount() {
    const code = localStorage.getItem('app-con-code');
    if(code && localStorage.getItem('app-con-valid')) {
      const title = localStorage.getItem('app-con-name')!;
      this.setState({ code, title });
      window.document.title = title;
    } else {
      localStorage.removeItem('app-con-code');
      localStorage.removeItem('app-con-name');
    }
  }

  private updateCode(code: string): void {
    this.setState({ code, error: '' });
  }

  private async checkCode(): Promise<void> {
    const { title } = JSON.parse(await get(`/con-info/${this.state.code}`));
    if(title) {
      this.setState({ title }, () => {
        localStorage.setItem('app-con-code', this.state.code);
        localStorage.setItem('app-con-name', this.state.title);
        localStorage.setItem('app-con-valid', 'ok');
        window.document.title = title;
      });
    } else {
      this.setState({ error: 'You are not signed up for that convention' });
    }
  }

  private close(): void {
    this.setState({
      code: '',
      title: '',
    });
    localStorage.removeItem('app-con-code');
    localStorage.removeItem('app-con-name');
    localStorage.removeItem('app-con-valid');
    window.document.title = 'ConArtist';
  }

  render() {
    if(this.state.title) {
      return <Sales title={this.state.title} close={() => this.close()} concode={this.state.code} />;
    } else {
      return (
        <div className='form'>
          <h1 className='form__title'>Enter Con Code</h1>
          <div>
            <TextField
              name='concode'
              floatingLabelText='Code'
              errorText={this.state.error}
              onChange={(_, text) => this.updateCode(text)}
              fullWidth />
            <div style={{ margin: 4 }}>
              <RaisedButton fullWidth primary label='Enter' onTouchTap={() => this.checkCode()} style={{ margin: '4px 0' }}/>
            </div>
          </div>
        </div>
      );
    }
  }
}
