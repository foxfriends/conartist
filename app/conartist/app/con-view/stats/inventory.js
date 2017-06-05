'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { ProductTypes, Colors } from '../../constants';
import { views, text } from '../../styles';

export default class Inventory extends Component {
  state = {
    type: 'Print11x17',
    settings: false,
  };

  get bars() {
    return this.state.type ? this.barsForType(this.state.type) : {};
  }
  get legend() {
    return {
      remaining: { name: 'Remaining', color: '#81C784' },
      sold: { name: 'Sold', color: '#E57373' },
    };
  }

  componentWillReceiveProps(props) {
     if(this.state.type === null) {
       this.setState({ type: Object.keys(props.products)[0] });
     }
  }

  barsForType(type) {
    const bars = {};
    (this.props.products[type] || []).forEach(([name, quantity]) => {
      bars[name] = { remaining: quantity, sold: 0 };
    });
    this.props.records
      .filter(({type: _}) => _ === type)
      .forEach(({ products }) => products.forEach(product => (++bars[product].sold, bars[product].remaining && --bars[product].remaining)));
    return bars;
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
        <Text style={[views.hPadded, text.subheading]}>Inventory</Text>
        <StackedBarChart yLabel='Quantity' bars={this.bars} legend={this.legend}/>
      </View>
    );
  }
}
