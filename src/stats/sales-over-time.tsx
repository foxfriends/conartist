'use strict';
import * as React from 'react';
import { Subheader, DatePicker, TimePicker, TextField, SelectField, MenuItem, Drawer, IconButton, AppBar } from 'material-ui';
import Settings from 'material-ui/svg-icons/action/settings'
import Close from 'material-ui/svg-icons/navigation/close'
import LineChart, { Bucket } from './chart/line-chart';
import * as Moment from 'moment';

import { Record, Metric } from '../types';

type Props = {
  records: Record[];
};
type State = {
  start: Date;
  end: Date;
  bucketSize: number;
  settings: boolean;
  metric: Metric;
  timeError: string;
  bucketError: string;
};

export default class SalesOverTime extends React.Component<Props, State> {
  state: State = {
    start: new Date(0),
    end: new Date(0),
    bucketSize: 1000 * 60 * 20,
    settings: false,
    metric: 'Customers',
    timeError: '',
    bucketError: '',
  };
  private get minTime(): number {
    return this.props.records.length
      ? this.roundToBucket(this.props.records.sort((a, b) => a.time - b.time)[0].time)
      : 0;
  }
  private get maxTime(): number {
    return this.props.records.length
      ? this.roundToBucket(this.props.records.sort((a, b) => b.time - a.time)[0].time)
      : 0;
  }
  constructor(props: Props) {
    super(props);
  }

  private roundToBucket(time: number): number {
    return Math.floor(time / this.state.bucketSize) * this.state.bucketSize;
  }

  private get buckets(): Bucket[] {
    const buckets = this.props.records
      .reduce((p, n) => this.reduceBuckets(p, n), [] as Bucket[])
      .sort((a, b) => a.time - b.time);
    for(let i = 0; i < buckets.length; ++i) {
      const expected = this.roundToBucket(this.state.start.getTime()) + i * this.state.bucketSize;
      if(buckets[i].time !== expected) {
        buckets.splice(i, 0, { quantity: 0, time: expected });
      }
    }
    while(this.roundToBucket(this.state.start.getTime()) + buckets.length * this.state.bucketSize <= this.state.end.getTime()) {
      buckets.push({ quantity: 0, time: this.roundToBucket(this.state.start.getTime()) + buckets.length * this.state.bucketSize})
    }
    return buckets;
  }

  private reduceBuckets(buckets: Bucket[], record: Record): Bucket[] {
    const updated = [...buckets];
    const time = this.roundToBucket(record.time);
    if(new Date(time) < this.state.start || new Date(time) > this.state.end) {
      return updated;
    }
    for(let bucket of updated) {
      if(time === bucket.time) {
        switch(this.state.metric) {
          case 'Customers':
            ++bucket.quantity;
            break;
          case 'Items Sold':
            bucket.quantity += record.quantity;
            break;
          case 'Money':
            bucket.quantity += record.price;
        }
        return updated;
      }
    }
    updated.push({ quantity: record.quantity, time });
    return updated;
  }

  componentWillReceiveProps(_: Props) {
    if(this.state.start.getTime() === 0) {
      setTimeout(
        () => this.setState({
          start: new Date(this.minTime),
          end: new Date(this.maxTime),
        })
      );
    }
  }

  private startChange(which: 'date' | 'time', date: Date): void {
    const { start } = this.state;
    if(which === 'date') {
      start.setDate(date.getDate());
      start.setMonth(date.getMonth());
      start.setFullYear(date.getFullYear());
    } else {
      start.setMinutes(date.getMinutes());
      start.setHours(date.getHours());
    }
    if(start < this.state.end) {
      this.setState({ start, timeError: '' });
    } else {
      this.setState({ start, timeError: 'Time range does not make sense' })
    }
  }
  private endChange(which: 'date' | 'time', date: Date): void {
    const { end } = this.state;
    if(which === 'date') {
      end.setDate(date.getDate());
      end.setMonth(date.getMonth());
      end.setFullYear(date.getFullYear());
    } else {
      end.setMinutes(date.getMinutes());
      end.setHours(date.getHours());
    }
    this.setState({ end });
    if(this.state.start < end) {
      this.setState({ end, timeError: '' });
    } else {
      this.setState({ end, timeError: 'Time range does not make sense' })
    }
  }
  private bucketChange(_: React.FormEvent<{}>, bucket: string): void {
    if(/^\d+(\.\d+)?$/.test(bucket) && +bucket !== 0) {
      this.setState({ bucketSize: +bucket * 60 * 1000, bucketError: '' });
    } else {
      this.setState({ bucketError: 'Not a usable group amount' });
    }
  }
  private metricChange(_: __MaterialUI.TouchTapEvent, __: number, metric: Metric): void {
    this.setState({ metric })
  }

  render() {
    return (
      <div style={{ position: 'relative'}}>
        <Subheader style={{ fontSize: '16px', fontFamily: 'Roboto,sans-serif' }}>Sales Over Time</Subheader>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 10 }}
          onTouchTap={() => this.setState({ settings: true })}>
          <Settings />
        </IconButton>
        <LineChart buckets={this.buckets} />
        <Drawer
          open={this.state.settings}
          openSecondary
          width='100%'
          style={{display: 'flex'}}>
          <AppBar
            title='Sales Over Time Settings'
            iconElementLeft={<IconButton><Close /></IconButton>}
            onLeftIconButtonTouchTap={() => this.setState({settings: false})} />
          <div style={{padding: '16px'}}>
            <DatePicker
              floatingLabelText='Start'
              formatDate={date => Moment(date).format('MMMM D, YYYY')}
              value={this.state.start}
              onChange={(_, date) => this.startChange('date', date)}
              errorText={this.state.timeError} />
            <TimePicker
              floatingLabelText='Start Time'
              pedantic
              value={this.state.start}
              onChange={(_, date) => this.startChange('time', date)}
              errorText={this.state.timeError} />
            <DatePicker
              floatingLabelText='End'
              formatDate={date => Moment(date).format('MMMM D, YYYY')}
              value={this.state.end}
              onChange={(_, date) => this.endChange('date', date)}
              errorText={this.state.timeError} />
            <TimePicker
              floatingLabelText='End Time'
              pedantic
              value={this.state.end}
              onChange={(_, date) => this.endChange('time', date)}
              errorText={this.state.timeError} />
            <div>
              <TextField
                floatingLabelText='Grouping (minutes)'
                defaultValue={this.state.bucketSize / 1000 / 60}
                onChange={(event, text) => this.bucketChange(event, text)}
                errorText={this.state.bucketError} />
            </div>
            <SelectField
              floatingLabelText='Metric'
              value={this.state.metric}
              onChange={(event, index, value: Metric) => this.metricChange(event, index, value)}>
              <MenuItem value={'Customers'} primaryText={'Customers'} />
              <MenuItem value={'Items Sold'} primaryText={'Items Sold'} />
              <MenuItem value={'Money'} primaryText={'Money'}/>
            </SelectField>
          </div>
        </Drawer>
      </div>
    )
  }
};
