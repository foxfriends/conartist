// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { views, text } from '../../styles';
import type { Bars, Legend } from '../../chart/stacked-bar-chart';
import type { Record, Records, Products, ProductType } from '../../conartist.types';

type Props = {
  records: Records,
  products: Products,
};

export default class Inventory extends Component<any, Props, any> {
  state = {
    type: 'Print11x17',
    settings: false,
  };

  get bars(): Bars {
    return this.state.type ? this.barsForType(this.state.type) : {};
  }
  get legend(): Legend {
    return {
      Remaining: '#81C784',
      Sold: '#E57373',
    };
  }

  componentWillReceiveProps(props: Props) {
     if(this.state.type === null) {
       this.setState({ type: Object.keys(props.products)[0] });
     }
  }

  barsForType(type: string): Bars {
    const bars = {};
    (this.props.products[type] || []).forEach(([name, quantity]) => {
      bars[name] = { Remaining: quantity, Sold: 0 };
    });
    this.props.records
      .filter(({type: _}) => _ === type)
      .forEach(({ products }) => products.forEach(product => (++bars[product].Sold, bars[product].Remaining && --bars[product].Remaining)));
    return bars;
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
        <Text style={[views.hPadded, text.subheading]}>Inventory</Text>
        <StackedBarChart yLabel='Quantity' bars={this.bars} legend={this.legend}/>
      </View>
    );
  }
}
