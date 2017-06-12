// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import BarChart from '../../chart/bar-chart';
import { views, text } from '../../styles';
import type { Bars } from '../../chart/bar-chart';
import type { Record } from '../../conartist.types';

export default class SalesPerType extends Component {
  state = {
    metric: 'Customers',
    settings: false,
  };

  get bars(): Bars {
    return this.props.records.reduce((p, n) => this.reduceBars(p, n), {});
  }

  reduceBars(bars: Bars, record: Record): Bars {
    const updated = { ...bars };
    updated[record.type] = updated[record.type] || 0;
    switch(this.state.metric) {
      case 'Customers':
        ++updated[record.type];
        break;
      case 'Items Sold':
        updated[record.type] += record.products.length;
        break;
      case 'Money':
        updated[record.type] += record.price;
    }
    return updated;
  }

  metricChange(metric: 'Customers' | 'Money' | 'Items') {
    this.setState({ metric });
  }

  render() {
    return (
      <View>
        <Text style={[views.hPadded, text.subheading]}>Sales Per Type</Text>
        <BarChart yLabel={this.state.metric} bars={this.bars} colors={this.props.colors} />
      </View>
    );
  }
}
