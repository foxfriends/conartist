'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text, Button, ScrollView } from 'react-native';
import FloatingActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { views, text } from '../../styles'
import Chip from './chip';

export default class ProductList extends Component {
  static navigationOptions = ({ navigation: { state: { params: { type }}}}) => ({ title: type })
  state = {
    selected: [],
    price: 0,
  };

  renderListItem(item) {
    const contents = (
      <View style={[views.listItem, views.paper]}>
        <Text style={[views.hPadded, text.primary]}>{item[0]}</Text>
      </View>
    );
    const props = {
      onPress: () => this.addItem(item)
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

  addItem(item) {
    this.setState({
      selected: [
        ...this.state.selected,
        item[0],
      ]
    });
  }

  removeItem(index) {
    const selected = [...this.state.selected];
    selected.splice(index, 1);
    this.setState({ selected });
  }

  render() {
    return (
      <View style={[views.flex, views.paper]}>
        <View style={{ height: 32, alignSelf: 'stretch', flexDirection: 'row' }}>
          <ScrollView horizontal={true} style={views.flex} showsHorizontalScrollIndicator={false}>
            { this.state.selected.map((item, i) => <Chip text={item} onPress={() => this.removeItem(i)} key={i} />)}
          </ScrollView>
        </View>
        <FlatList
          data={this.props.screenProps.data.products[this.props.navigation.state.params.type]}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({item}) => this.renderListItem(item)} />
        <FloatingActionButton
          onPress={() => this.savePurchase()}
          buttonColor="#0099cc" />
      </View>
    );
  }
}
