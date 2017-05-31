'use strict';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import ConCode from './con-code';

import './app.scss';

ReactDOM.render(
  <MuiThemeProvider>
    <ConCode />
  </MuiThemeProvider>,
  document.querySelector('#app')
);
