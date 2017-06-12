// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { views, text } from '../../styles';
import type { Bars, Legend } from '../../chart/stacked-bar-chart';
import type { Record, ProductType } from '../../conartist.types';

export default class SalesPerDesign extends Component {
  state = {
    type: 'All',
    settings: false,
  };

  get bars(): Bars {
    return this.props.records
      .filter(record => this.state.type === 'All' || this.state.type === record.type)
      .reduce((p, n) => this.reduceBars(p, n), {});
  }
  get legend(): Legend {
    return Object.keys(this.props.products)
      .reduce((obj, key) => ({ ...obj, [key]: this.props.colors[key] }), {});
  }
  reduceBars(bars: Bars, record: Record): Bars {
    const updated = { ...bars };
    for(const product of record.products) {
      updated[product] = updated[product] || {};
      updated[product][record.type] = updated[product][record.type] || 0;
      ++updated[product][record.type];
    }
    return updated;
  }

  typeChange(type: ProductType) {
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
