'use strict';
import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { views, pages, text } from './styles';

const WEBSITE_URL = 'conartist.com';

export default class SignIn extends Component {
  static navigationOptions = {
    title: 'ConArtist Sign In',
  }

  async signIn() {
    try {
      await this.props.screenProps.signIn()
      this.props.navigation.navigate('ConCode');
    } catch(_) {
      // login failed
    }
  }

  render() {
    return (
      <View style={[ views.flex, pages.signIn, views.vMiddle ]}>
        <View style={[ views.margined, views.padded, views.paper ]}>
          <TextInput
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='E-mail'
            keyboardType='email-address'
            returnKeyType='next'
            onSubmitEditing={() => this.refs.password.focus()}
            onChangeText={text => this.props.screenProps.updateUser(text)} />
          <TextInput
            ref='password'
            autoCorrect={false}
            autoCapitalize='none'
            blurOnSubmit={true}
            secureTextEntry={true}
            placeholder='Password'
            returnKeyType='done'
            onChangeText={text => this.props.screenProps.updatePass(text)} />
          <Button
            title='Sign In'
            onPress={() => this.signIn()} />
          <Text style={views.padded}>
            Need an account? Set one up online at { WEBSITE_URL }
          </Text>
        </View>
      </View>
    );
  }
}
