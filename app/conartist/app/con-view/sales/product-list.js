'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text, Button } from 'react-native';
import FloatingActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { views } from '../../styles'

export default class ProductList extends Component {
  static navigationOptions = ({ navigation: { state: { params: { type }}}}) => ({ title: type })

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      price: 0,
    };
  }

  renderListItem(item) {
    const contents = (
      <View style={[views.listItem, views.paper]}>
        <Text style={views.hPadded}>{item[0]}</Text>
      </View>
    );
    const props = {
      onPress: () => {}
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

  savePurchase() {
    this.props.screenProps.savePurchase(this.props.navigation.state.params.type, this.state.selected, this.state.price)
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={[views.flex, views.paper]}>
        <FlatList
          data={this.props.screenProps.data.products[this.props.navigation.state.params.type]}
          keyExtractor={({item}) => item}
          renderItem={({item}) => this.renderListItem(item)} />
        <FloatingActionButton
          onPress={() => this.savePurchase()}
          buttonColor="#0099cc" />
      </View>
    );
  }
}
