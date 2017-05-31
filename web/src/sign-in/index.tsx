'use strict';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import SignIn from './sign-in';

import './index.scss';

ReactDOM.render(
  <MuiThemeProvider>
    <SignIn />
  </MuiThemeProvider>,
  document.querySelector('#sign-in')
);
