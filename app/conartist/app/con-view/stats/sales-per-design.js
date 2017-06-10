// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { views, text } from '../../styles';

export default class SalesPerDesign extends Component {
  state = {
    type: 'All',
    settings: false,
  };

  get bars() {
    return this.props.records
      .filter(record => this.state.type === 'All' || this.state.type === record.type)
      .reduce((p, n) => this.reduceBars(p, n), {});
  }
  get legend() {
    return Object.keys(this.props.products)
      .reduce((obj, key) => ({ ...obj, [key]: this.props.colors[key] }), {});
  }
  reduceBars(bars, record) {
    const updated = { ...bars };
    for(const product of record.products) {
      updated[product] = updated[product] || {};
      updated[product][record.type] = updated[product][record.type] || 0;
      ++updated[product][record.type];
    }
    return updated;
  }

  typeChange(type) {
    this.setState({ type });
  }

  render() {
    return (
      <View>
        <Text style={[views.hPadded, text.subheading]}>Sales Per Design</Text>
        <StackedBarChart yLabel='Sales' bars={this.bars} legend={this.legend}/>
      </View>
    );
  }
}
