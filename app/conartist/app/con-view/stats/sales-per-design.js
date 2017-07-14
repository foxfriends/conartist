// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { views, text } from '../../styles';
import type { Bars, Legend } from '../../chart/stacked-bar-chart';
import type { Record, ProductType, Product } from '../../conartist.types';

export default class SalesPerDesign extends Component {
  state = {
    type: 'All',
    settings: false,
  };

  get bars(): Bars {
    return []
      .concat(...this.props.records.map(_ => _.products))
      .map(id => this.props.products.find(_ => _.id === id))
      .filter(product => this.state.type === 'All' || this.state.type === this.type(product.type).name)
      .reduce((p, n) => this.reduceBars(p, n), {});
  }
  get legend(): Legend {
    return this.props.types.reduce((obj, type) => ({ ...obj, [type.name]: `#${type.color.toString(16)}` }), {});
  }
  type(id: number): ProductType {
    return this.props.types.find(_ => _.id === id);
  }
  reduceBars(bars: Bars, product: Product): Bars {
    const updated = { ...bars };
    const type = this.type(product.type);
    updated[product.name] = updated[product.name] || {};
    updated[product.name][type.name] = updated[product.name][type.name] || 0;
    ++updated[product.name][type.name];
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
