// @flow
'use strict';
import React, { PureComponent } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { views, text } from '../../styles';

export default class Chip extends PureComponent {
  state = { backgroundColor: '#E0E0E0' };

  render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={() => this.setState({backgroundColor: '#D0D0D0'})}
        onPressOut={() => this.setState({ backgroundColor: '#E0E0E0'})}
        onPress={ this.props.onPress }>
        <View style={[views.chip, { backgroundColor: this.state.backgroundColor }]}>
          <Text style={[text.chip, text.primary]}>{ this.props.text }</Text>
          <View style={views.chipClose}>
            <Icon name='close' color='#ddd' />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
