// @flow
'use strict';
import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { views, pages, text } from './styles';

export default class ConCode extends Component {
  static navigationOptions = {
    title: 'Enter Convention',
  }
  state = { errorMessage: null };

  async loadCon() {
    try {
      await this.props.screenProps.loadCon();
      this.setState({ errorMessage: null });
      this.props.navigation.navigate('ConView');
    } catch(error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    return (
      <View style={[ views.flex, pages.signIn, views.vMiddle ]}>
        <View style={[ views.margined, views.padded, views.paper ]}>
          <Text style={text.heading}>ConArtist</Text>
          <TextInput
            autoCorrect={false}
            autoCapitalize='characters'
            placeholder='Con Code'
            returnKeyType='next'
            onChangeText={text => this.props.screenProps.updateCode(text)} />
          { this.state.errorMessage &&
            <Text style={[views.padded, text.error]}>
              { this.state.errorMessage }
            </Text>
          }
          <Button
            title='Enter con'
            onPress={() => this.loadCon()} />
        </View>
      </View>
    );
  }
}
