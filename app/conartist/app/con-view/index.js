// @flow
'use strict';
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import Sales from './sales';
import History from './history';
import Stats from './stats';

const ConView = TabNavigator({
  Sales: { screen: Sales },
  // History: { screen: History },
  // Stats: { screen: Stats },
}, {
  initialRouteName: 'Sales',
  order: [ 'Sales', ] // 'History', 'Stats' ]
});
ConView.navigationOptions = ({ screenProps: { title }}) => ({ title });
export default ConView;
