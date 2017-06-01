'use strict';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './app/index.js';

export default class ConArtist extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('conartist', () => ConArtist);
