// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.init();
  }

  async init() {
    const list = await this.props.screenProps.loadSettings();
    list.forEach(this.props.navigation.navigate);
  }

  render() {
    return (
      // TODO: make a pretty splash screen!
      <View>
        <Text>conartist loading</Text>
      </View>
    );
  }
}
