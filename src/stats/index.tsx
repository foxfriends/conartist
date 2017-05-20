'use strict';
import * as React from 'react';

import SalesPerDesign from './sales-per-design';
import SalesPerType from './sales-per-type';
import SalesOverTime from './sales-over-time';
import { SalesData } from '../types';

type Props = {
  data: Readonly<SalesData>;
};
type State = {};

export default class Stats extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <SalesPerDesign records={this.props.data.records} />
        <SalesPerType records={this.props.data.records} />
        <SalesOverTime records={this.props.data.records} />
      </div>
    )
  }
};
