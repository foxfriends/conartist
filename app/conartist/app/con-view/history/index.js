// @flow
'use strict';
import React, { Component } from 'react';
import { Platform, TouchableHighlight, TouchableNativeFeedback, View, FlatList, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import numeral from 'numeral';
import moment from 'moment';
import type { Record } from '../../conartist.types';

import { views, text } from '../../styles'

const unique = <T>(v: T, i: number, arr: T[]): boolean => arr.indexOf(v) === i;

export default class History extends Component {
  static navigationOptions = {
    title: 'History',
    tabBarIcon: <Icon name='history' size={24} color='white'/>,
  };

  product(id: number): Product {
    return this.props.screenProps.data.products.find(_ => _.id === id);
  }

  type(record: Record): ProductType {
    const products = record.products.filter(unique).map(id => this.product(id));
    const typeIds = products.map(_ => _.type).filter(unique);
    if(typeIds.length === 1) {
      return this.props.screenProps.data.types.find(_ => _.id === typeIds[0]);
    } else {
      return { color: 0x000000, name: '?', discontinued: false, id: -1 };
    }
  }

  renderListItem(item: Record) {
    const products = item.products.reduce((o, p) => (o[p] = o[p] ? o[p] + 1 : 1, o), {});
    const productStr = Object.keys(products).map(key => {
      const name = this.product(+key).name;
      return products[key] === 1 ? name : `${name} (${products[key]})`;
    }).join(', ');
    const type = this.type(item);
    const contents = (
      <View style={[views.listItem, views.paper, views.padded, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={[views.circle, { backgroundColor: `#${type.color.toString(16)}` }]}>
          <View style={[views.flex, views.vMiddle, views.hMiddle]}>
            <Text style={[text.icon, { color: 'white' }]}>{ type.name[0] }</Text>
          </View>
        </View>
        <View style={[views.hPadded]}>
          <Text style={[text.primary]}>{ productStr }</Text>
          <Text style={[text.secondary]}>
            {moment(item.time).format('MMM D, h:mm a')} &mdash; {numeral(item.price).format('$0,0.00')}
          </Text>
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
        <TouchableHighlight style={[views.flex]}>
          { contents }
        </TouchableHighlight>
      );
    }
  }

  render() {
    return (
      <View style={[views.flex, views.paper]}>
        { this.props.screenProps.data.records.length
          ? <FlatList
              data={this.props.screenProps.data.records}
              keyExtractor={(_, i) => `${i}`}
              renderItem={({item}) => this.renderListItem(item)} />
          : <View style={[views.flex, views.vMiddle, views.hMiddle]}>
              <Text style={text.secondary}>
                You haven't sold anything yet
              </Text>
            </View>
        }
      </View>
    );
  }
}
