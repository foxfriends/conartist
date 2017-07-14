// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import BarChart from '../../chart/bar-chart';
import { views, text } from '../../styles';
import type { Bars } from '../../chart/bar-chart';
import type { Record, Product } from '../../conartist.types';

// TODO: reduce duplication of this function
const unique = <T>(v: T, i: number, arr: T[]): boolean => arr.indexOf(v) === i;

export default class SalesPerType extends Component {
  state = {
    metric: 'Customers',
    settings: false,
  };

  get bars(): Bars {
    return this.props.records.reduce((p, n) => this.reduceBars(p, n), {});
  }
  type(id: number): ProductType {
    return this.props.types.find(_ => _.id === id);
  }
  reduceBars(bars: Bars, record: Record): Bars {
    const updated = { ...bars };
    const products = record.products.map(id => this.props.products.find(_ => _.id === id));
    const types = products.map(_ => this.type(_.type));
    types.forEach(type => updated[type.name] = updated[type.name] || 0);
    switch(this.state.metric) {
      case 'Customers':
        types.filter(unique).forEach(_ => ++updated[_.name]);
        break;
      case 'Items Sold':
        types.forEach(_ => ++updated[_.name]);
        break;
      case 'Money':
        // NOTE: this will be very wrong if records contain more than one type
        //       which is technically supported, but should never happen because
        //       of lacking features in the UI
        types.filter(unique).forEach(_ => updated[record.type] += record.price);
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
