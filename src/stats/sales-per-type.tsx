'use strict';
import * as React from 'react';
import { Subheader, SelectField, MenuItem, Drawer, IconButton, AppBar, RaisedButton } from 'material-ui';
import Settings from 'material-ui/svg-icons/action/settings'
import Close from 'material-ui/svg-icons/navigation/close'
import BarChart from './chart/bar-chart';
import { saveAs } from 'file-saver';

import { Record, ProductTypes, Metric, Colors } from '../types';

type Props = {
  records: Record[];
};
type State = {
  metric: Metric;
  settings: boolean;
};

export default class SalesPerType extends React.Component<Props, State> {
  state: State = {
    metric: 'Customers',
    settings: false
  };

  private get bars(): { [key in keyof ProductTypes]: number } {
    return this.props.records.reduce((p: { [key in keyof ProductTypes]: number }, n) => this.reduceBars(p, n), {
      Print11x17: 0,
      Print5x7: 0,
      Sticker: 0,
      HoloSticker: 0,
      Button: 0,
      Other: 0,
    });
  }

  private reduceBars(bars: { [key in keyof ProductTypes]: number }, record: Record): { [key in keyof ProductTypes]: number } {
    const updated = { ...bars };
    switch(this.state.metric) {
      case 'Customers':
        ++updated[record.type];
        break;
      case 'Items Sold':
        updated[record.type] += record.quantity;
        break;
      case 'Money':
        updated[record.type] += record.price;
    }
    return updated;
  }

  private metricChange(_: __MaterialUI.TouchTapEvent, __: number, metric: Metric): void {
    this.setState({ metric });
  }

  private save(): void {
    const data = this.props.records
      .reduce((prev: { [key in keyof ProductTypes]: { customers: number; items: number; money: number; }; }, record) => {
        const updated = { ...prev };
        ++updated[record.type].customers;
        updated[record.type].items += record.quantity;
        updated[record.type].money += record.price;
        return updated;
      }, {
        Print11x17: { customers: 0, items: 0, money: 0 },
        Print5x7: { customers: 0, items: 0, money: 0 },
        Sticker: { customers: 0, items: 0, money: 0 },
        HoloSticker: { customers: 0, items: 0, money: 0 },
        Button: { customers: 0, items: 0, money: 0 },
        Other: { customers: 0, items: 0, money: 0 },
      });
    const blob = new Blob([
      `Type,Customers,Items,Money\n` +
      Object.keys(data).map((key: keyof ProductTypes) => `${key},${data[key].customers},${data[key].items},${data[key].money}`).join('\n')
    ]);
    saveAs(blob, 'sales-per-type.csv', true);
  }

  render() {
    return (
      <div style={{ position: 'relative'}}>
        <Subheader style={{ fontSize: '16px', fontFamily: 'Roboto,sans-serif' }}>Sales Per Type</Subheader>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 10 }}
          onTouchTap={() => this.setState({ settings: true })}>
          <Settings />
        </IconButton>
        <BarChart bars={this.bars} colors={Colors} />
        <Drawer
          open={this.state.settings}
          openSecondary
          width='100%'
          style={{display: 'flex'}}>
          <AppBar
            title='Sales Per Design Settings'
            iconElementLeft={<IconButton><Close /></IconButton>}
            onLeftIconButtonTouchTap={() => this.setState({settings: false})} />
          <div style={{padding: 16}}>
            <SelectField
              floatingLabelText='Metric'
              value={this.state.metric}
              onChange={(event, index, value: Metric) => this.metricChange(event, index, value)}>
              <MenuItem value={'Customers'} primaryText={'Customers'} />
              <MenuItem value={'Items Sold'} primaryText={'Items Sold'} />
              <MenuItem value={'Money'} primaryText={'Money'}/>
            </SelectField>
          </div>
          <div style={{padding: 16}}>
            <RaisedButton label='Export All' primary onTouchTap={() => this.save()}/>
          </div>
        </Drawer>
      </div>
    )
  }
};
