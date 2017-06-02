'use strict';
import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { views, pages, text } from './styles';

export default class ConCode extends Component {
  static navigationOptions = {
    title: 'Enter Convention',
  }

  loadCon() {
    this.props.screenProps.loadCon();
    this.props.navigation.navigate('ConView');
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
          <Button
            title='Enter con'
            onPress={() => this.loadCon()} />
        </View>
      </View>
    );
  }
}
