// @flow
'use strict';
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import SalesPerType from './sales-per-type';
import SalesPerDesign from './sales-per-design';
import SalesOverTime from './sales-over-time';
import Inventory from './inventory';
import { views } from '../../styles'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Stats extends Component {
  static navigationOptions = {
    title: 'Stats',
    tabBarIcon: <Icon name='show-chart' size={24} color='white'/>,
  };
  render() {
    return (
      <ScrollView style={[views.flex, views.paper, views.vPadded]}>
        <SalesPerDesign products={this.props.screenProps.data.products} records={this.props.screenProps.data.records} colors={this.props.screenProps.data.colors}/>
        <SalesPerType products={this.props.screenProps.data.products} records={this.props.screenProps.data.records} colors={this.props.screenProps.data.colors}/>
        <SalesOverTime records={this.props.screenProps.data.records} />
        <Inventory products={this.props.screenProps.data.products} records={this.props.screenProps.data.records}/>
      </ScrollView>
    );
  }
}
