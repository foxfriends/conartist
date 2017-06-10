// @flow
'use strict';
import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import LineChart from '../../chart/line-chart';
import { views, text } from '../../styles';

export default class SalesOverTime extends Component {
  size = Dimensions.get('window').width;
  state = {
    start: new Date(0),
    end: new Date(0),
    bucketSize: 1000 * 60 * 20,
    settings: false,
    metric: 'Customers',
  };

  roundToBucket(time) {
    return Math.floor(time / this.state.bucketSize) * this.state.bucketSize;
  }

  get buckets() {
    const buckets = this.props.records
      .reduce((p, n) => this.reduceBuckets(p, n), [])
      .sort((a, b) => a.time - b.time);
    for(let i = 0; i < buckets.length; ++i) {
      const expected = this.roundToBucket(this.state.start.getTime()) + i * this.state.bucketSize;
      if(buckets[i].time !== expected) {
        buckets.splice(i, 0, { quantity: 0, time: expected });
      }
    }
    if(buckets.length === 0) { return buckets; }
    // TODO: why does this die so bad.
    const min = Math.max(this.state.start.getTime(), buckets[0].time);
    const max = Math.min(this.state.end.getTime() || Infinity, buckets[buckets.length - 1].time);
    while(this.roundToBucket(min) + buckets.length * this.state.bucketSize <= max) {
      buckets.push({ quantity: 0, time: this.roundToBucket(this.state.start.getTime()) + buckets.length * this.state.bucketSize});
    }
    return buckets;
  }

  reduceBuckets(buckets, record) {
    const updated = [...buckets];
    const time = this.roundToBucket(record.time);
    if(new Date(time) < this.state.start || new Date(time) > this.state.end) {
      return updated;
    }
    for(const bucket of updated) {
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

  render() {
    const buckets = this.buckets;
    return (
      <View>
      <Text style={[views.hPadded, text.subheading]}>Sales Over Time</Text>
      { buckets.length > 1
        ? <LineChart yLabel={this.state.metric} buckets={buckets} />
        : <View style={[views.vMiddle, views.hMiddle, views.padded, { width: this.size, height: this.size, }]}>
            <Text>No sales in this time range</Text>
          </View>
      }
      </View>
    );
  }
}
