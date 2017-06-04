'use strict';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
// import { cyan400 as barColor } from 'material-ui/styles/colors';
import * as d3 from 'd3-scale';
import Axis from './axis';
import Svg, { G, Rect, Text } from 'react-native-svg';

export default class BarChart extends Component {
  size = Dimensions.get('window').width;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  width = this.size - this.margin.left - this.margin.right;
  height = this.size - this.margin.top - this.margin.bottom;

  get chartRenderer() {
    const max = Math.max(...Object.values(this.props.bars));
    const x = d3.scaleBand()
      .domain(Object.keys(this.props.bars))
      .rangeRound([0, this.width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, max])
      .rangeRound([this.width, 0]);
    const color = (name, data) => {
      if(typeof this.props.colors === 'function') {
        return this.props.colors(data);
      } else if(typeof this.props.colors === 'object') {
        return this.props.colors[name];
      } else {
        return '#000';
      }
    }
    return { x, y, color };
  }

  render() {
    const { x, y, color } = this.chartRenderer;
    return (
      <View style={{ flex: 1 }}>
        <Svg style={{ flex: 1, }} width={this.size} height={this.size}>
          <G width={this.size} height={this.size} x={this.margin.left} y={this.margin.top}>
            <G y={this.height}>
              <Axis orient={'bottom'} scale={x} ticks={0} />
            </G>
            <G>
              <Text fill='black' rotate={-90} y={6} dy={-15} textAnchor='end'>{ this.props.yLabel || 'Y' }</Text>
              <Axis orient={'left'} scale={y} />
            </G>
            <G>
              { Object.entries(this.props.bars).map(([name, data]) =>
                <Rect key={name} x={x(name)} y={y(data)} fill={color(name, data)} width={x.bandwidth()} height={this.height - y(data)} />
              )}
            </G>
            <G>
              { Object.keys(this.props.bars).map(name =>
                <Text
                  key={name}
                  y={x(name) + x.bandwidth() / 2}
                  x={5 - this.height}
                  dy={-20 /* TODO: center this (-0.35em) */}
                  rotate={-90}
                  textAnchor='start'
                  fill='#333'
                  vertialAlign='middle'
                  fontSize={Math.min(14, x.bandwidth())}>
                  {name}
                </Text>
              )}
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}
