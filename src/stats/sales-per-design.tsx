'use strict';
import * as React from 'react';
import { Subheader, SelectField, MenuItem, Drawer, IconButton, AppBar, RaisedButton } from 'material-ui';
import Settings from 'material-ui/svg-icons/action/settings'
import Close from 'material-ui/svg-icons/navigation/close'
import StackedBarChart from './chart/stacked-bar-chart';
import { saveAs } from 'file-saver';

import { Record, ProductTypes, Colors } from '../types';

type Props = {
  records: Record[];
};
type State = {
  type: keyof ProductTypes | 'All';
  settings: boolean;
};

export default class SalesPerDesign extends React.Component<Props, State> {
  state: State = {
    type: 'All',
    settings: false
  };
  private get bars(): { [key: string]: { [key in keyof ProductTypes]: number } } {
    return this.props.records
      .filter(record => this.state.type === 'All' || this.state.type === record.type)
      .reduce((p, n) => this.reduceBars(p, n), {} as { [key: string]: { [key in keyof ProductTypes]: number } });
  }
  private get legend(): { [key: string]: { color: string, name: string } } {
    return Object.keys(ProductTypes)
      .reduce((obj: { [key: string]: { color: string, name: string } }, key: keyof ProductTypes) => ({ ...obj, [key]: { color: Colors[key], name: ProductTypes[key] }}), {})
  }

  private reduceBars(bars: { [key: string]: { [key in keyof ProductTypes]: number } }, record: Record): { [key: string]: { [key in keyof ProductTypes]: number } } {
    const updated = { ...bars };
    for(let product of record.products) {
      updated[product] = updated[product] || {
        Print11x17: 0,
        Print5x7: 0,
        Sticker: 0,
        HoloSticker: 0,
        Button: 0,
        Other: 0,
      };
      ++updated[product][record.type];
    }
    return updated;
  }

  private typeChange(_: __MaterialUI.TouchTapEvent, __: number, type: keyof ProductTypes | 'All') {
    this.setState({ type });
  }

  private save(): void {
    const data = this.props.records
      .reduce((p, n) => this.reduceBars(p, n), {} as { [key: string]: { [key in keyof ProductTypes]: number } })
    const blob = new Blob([
      'Design,Total,Print 11x17,Print 5x7,Sticker,Holo Sticker,Button,Other\n' +
      Object.keys(data).map(
        key => `${key},${Object.keys(data[key]).reduce((_, p: keyof ProductTypes) => _ + data[key][p], 0)},${data[key].Print11x17},${data[key].Print5x7},${data[key].Sticker},${data[key].HoloSticker},${data[key].Button},${data[key].Other}`
      ).join('\n')
    ]);
    saveAs(blob, 'sales-per-design.csv', true)
  }

  render() {
    return (
      <div style={{ position: 'relative'}}>
        <Subheader style={{ fontSize: '16px', fontFamily: 'Roboto,sans-serif' }}>Sales Per Design</Subheader>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 10 }}
          onTouchTap={() => this.setState({ settings: true })}>
          <Settings />
        </IconButton>
        <StackedBarChart bars={this.bars} legend={this.legend}/>
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
              floatingLabelText='Product Type'
              value={this.state.type}
              onChange={(event, index, value: keyof ProductTypes | 'All') => this.typeChange(event, index, value)}>
              { ['All', ...Object.keys(ProductTypes)].map((type: keyof ProductTypes | 'All', i) =>
                <MenuItem key={i} value={type} primaryText={type === 'All' ? 'All' : ProductTypes[type]} />
              ) }
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
