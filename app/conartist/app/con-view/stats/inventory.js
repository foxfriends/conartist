// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StackedBarChart from '../../chart/stacked-bar-chart';
import { views, text } from '../../styles';
import type { Bars, Legend } from '../../chart/stacked-bar-chart';
import type { Record, Records, Products, ProductTypes } from '../../conartist.types';

type Props = {
  records: Records,
  products: Products,
  types: ProductTypes,
};

export default class Inventory extends Component<any, Props, any> {
  state = {
    type: null,
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
       this.setState({ type: props.types[0] });
     }
  }

  product(id: number): Product {
    return this.props.products.find(_ => _.id === id);
  }

  barsForType(type: ProductType): Bars {
    const bars = {};
    this.props.products
      .filter(_ => _.type === type.id)
      .forEach(({ name, quantity }) => bars[name] = { Remaining: quantity, Sold: 0 });
    [].concat(...this.props.records.map(_ => _.products))
      .map(_ => this.product(_))
      .filter(_ => _.type === type.id)
      .forEach(_ => ++bars[_.name].Sold);
    return bars;
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
