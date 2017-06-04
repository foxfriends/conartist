'use strict';
import React, { Component } from 'react';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { ProductTypes, Colors } from '../../constants'

export default class SalesPerDesign extends Component {
  state: State = {
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
      .reduce((obj, key) => ({ ...obj, [key]: { color: Colors[key], name: ProductTypes[key] }}), {});
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

  render() {
    return (
      <StackedBarChart yLabel='Sales' bars={this.bars} legend={this.legend}/>
    );
  }
}
