'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text } from 'react-native';
import { views } from '../../styles'

export default class ProductTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productTypes: Object.keys(props.screenProps.data.products),
      selectedType: '',
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ productTypes: Object.keys(props.screenProps.data.products) });
  }

  renderListItem(item) {
    const contents = (
      <View style={[views.listItem, views.paper]}>
        <Text style={views.hPadded}>{item}</Text>
      </View>
    );
    const props = {
      onPress: () => this.props.navigation.navigate('ProductList', { type: item })
    };
    if(Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback { ...props }>
          { contents }
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <View style={[views.listItem, views.listItemBacking]}>
          <TouchableHighlight { ...props }>
            { contents }
          </TouchableHighlight>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={[views.flex, views.paper]}>
        <FlatList
          data={this.state.productTypes}
          keyExtractor={({item}) => item}
          renderItem={({item}) => this.renderListItem(item)} />
      </View>
    );
  }
}
