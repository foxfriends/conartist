'use strict';
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import Axis from './axis';
import Svg, { G, Rect, Text } from 'react-native-svg';
const d3 = { ...scale, ...shape };

export default class StackedBarChart extends Component {
  size = Dimensions.get('window').width;
  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  width = this.size - this.margin.left - this.margin.right;
  height = this.size - this.margin.top - this.margin.bottom;

  get chartRenderer() {
    const max = Math.max(...Object.values(this.props.bars).map(_ => Object.values(_).reduce((a, _) => a + _, 0)));
    const x = d3.scaleBand()
      .domain(Object.keys(this.props.bars))
      .rangeRound([0, this.width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, max])
      .rangeRound([this.height, 0]);
    const color = d3.scaleOrdinal()
      .domain(Object.keys(this.props.legend))
      .range(Object.values(this.props.legend));
    const stack = d3.stack()
      .keys(Object.keys(this.props.legend));
    return { x, y, color, stack };
  }

  render() {
    const { x, y, color, stack } = this.chartRenderer;
    return (
      <View style={{ flex: 1 }}>
        <Svg style={{ flex: 1 }} width={this.size} height={this.size}>
          <G width={this.size} height={this.size} x={this.margin.left} y={this.margin.top}>
            <G y={this.height}>
              <Axis orient='bottom' scale={x} ticks={0} />
            </G>
            <G>
              <Text fill='black' rotate={-90} y={6} dy={-15} textAnchor='end'>{ this.props.yLabel || 'Y' }</Text>
              <Axis orient='left' scale={y} />
            </G>
            <G>
            { stack(Object.entries(this.props.bars).map(([name, data]) => ({ name, ...data }))).map((data, i) =>
                <G key={`${i}`} fill={color(data.key)}>
                  { data.map((d, i) =>
                    <Rect key={`${i}`} x={x(d.data.name)} y={y(d[1])} width={x.bandwidth()} height={y(d[0]) - y(d[1])} />
                  )}
                </G>
              )}
            </G>
            <G>
              { Object.keys(this.props.bars).map(name =>
                <Text
                  key={name}
                  y={x(name) + x.bandwidth() / 2}
                  x={5 - this.height}
                  dy={-20}
                  rotate={-90}
                  textAnchor='start'
                  fill='#333'
                  fontSize={Math.min(14, x.bandwidth())}>
                  {name}
                </Text>
              )}
            </G>
            <G>
              { Object.entries(this.props.legend).reverse().map(([name, data], i) =>
                <G key={name} y={i * 20}>
                  <Rect x={this.width - 19} width={19} height={19} fill={color(name)} />
                  <Text x={this.width - 24} y={9.5} dy={-15} textAnchor='end' fontSize={10}>{ name }</Text>
                </G>
              )}
            </G>
          </G>
        </Svg>
      </View>
    );
  }
}
