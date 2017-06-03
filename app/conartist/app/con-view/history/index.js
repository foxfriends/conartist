'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text } from 'react-native';
import { views, text } from '../../styles'
import { ProductTypes, Colors } from '../../constants';

export default class History extends Component {
  renderListItem(item) {
    // TODO: make this meaningful
    const contents = (
      <View style={[views.listItem, views.paper, views.padded, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={[views.circle, { backgroundColor: Colors[item.type] }]}>
          <View style={[views.flex, views.vMiddle, views.hMiddle]}>
            <Text style={[text.icon, { color: 'white' }]}>{ ProductTypes[item.type][0] }</Text>
          </View>
        </View>
        <View style={[views.hPadded]}>
          <Text style={[text.primary]}>{ item.products.join(', ') }</Text>
          <Text style={[text.secondary]}>{ item.price }</Text>
        </View>
      </View>
    );
    if(Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback>
          { contents }
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <View style={[views.listItem, views.listItemBacking]}>
          <TouchableHighlight>
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
          data={this.props.screenProps.data.records}
          keyExtractor={(_, i) => `${i}`}
          renderItem={({item}) => this.renderListItem(item)} />
      </View>
    );
  }
}
