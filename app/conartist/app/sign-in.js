'use strict';
import React, { Component } from 'react';
import { Text, TextInput, View, Button } from 'react-native';
import { views, pages, text } from './styles';

const WEBSITE_URL = 'conartist.com';

export default class SignIn extends Component {
  render() {
    return (
      <View style={[ views.margined, views.padded, views.paper ]}>
        <Text style={text.heading}>ConArtist sign-in</Text>
        <TextInput
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='E-mail'
          keyboardType='email-address'
          returnKeyType='next'
          onSubmitEditing={() => this.refs.password.focus()}
          onChangeText={text => this.props.updateUser(text)} />
        <TextInput
          ref='password'
          autoCorrect={false}
          autoCapitalize='none'
          blurOnSubmit={true}
          secureTextEntry={true}
          placeholder='Password'
          returnKeyType='done'
          onChangeText={text => this.props.updatePass(text)} />
        <Button
          title='Sign In'
          onPress={() => this.props.onSubmit()} />
        <Text style={views.padded}>
          Need an account? Set one up online at { WEBSITE_URL }
        </Text>
      </View>
    );
  }
}
