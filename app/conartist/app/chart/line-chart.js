// @flow
'use strict';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import Axis from './axis';
import Svg, { G, Rect, Text, Path } from 'react-native-svg';
const d3 = { ...scale, ...shape };

export default class LineChart extends Component {
  size = Dimensions.get('window').width;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  width = this.size - this.margin.left - this.margin.right;
  height = this.size - this.margin.top - this.margin.bottom;

  get chartRenderer(): {
    const x = d3.scaleTime()
      .rangeRound([0, this.width])
      .domain([
        Math.min(...this.props.buckets.map(_ => _.time)),
        Math.max(...this.props.buckets.map(_ => _.time)),
      ]);
    const y = d3.scaleLinear()
      .domain([0, Math.max(...this.props.buckets.map(_ => _.quantity))])
      .rangeRound([this.height, 0]);
    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.quantity));
    return { x, y, line };
  }

  render() {
    if(this.props.buckets.length <= 1) return null;
    const { x, y, line } = this.chartRenderer;
    return (
      <View style={{ flex: 1 }}>
        <Svg style={{ flex: 1 }} width={this.size} height={this.size}>
          <G width={this.size} height={this.size} x={this.margin.left} y={this.margin.top}>
            <G y={this.height}>
              <Axis orient={'bottom'} scale={x} ticks={9} />
            </G>
            <G>
              <Text fill='black' rotate={-90} y={6} dy={-15} textAnchor='end'>{ this.props.yLabel || 'Y' }</Text>
              <Axis orient={'left'} scale={y} />
            </G>
            <Path fill='none' stroke='#26C6DA' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d={line(this.props.buckets)}/>
          </G>
        </Svg>
      </View>
    );
  }
}
