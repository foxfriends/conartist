'use strict';
import * as React from 'react';

import SalesPerDesign from './sales-per-design';
import SalesPerType from './sales-per-type';
import SalesOverTime from './sales-over-time';
import Inventory from './inventory';
import { Products, Record, SalesData } from '../types';

type Props = {
  products: Products;
  records: Record[];
  store: Readonly<SalesData>;
};
type State = {};

export default class Stats extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <SalesPerDesign products={this.props.products} records={this.props.records} />
        <SalesPerType products={this.props.products} records={this.props.records} />
        <SalesOverTime records={this.props.records} />
        <Inventory products={this.props.store.products} records={this.props.records} />
      </div>
    )
  }
};
