'use strict';
import React, { Component } from 'react';
import { G, Path, Line, Text } from 'react-native-svg';

function center(scale, value) {
  let offset = 0;
  if(scale.bandwidth) {
    offset = Math.max(0, scale.bandwidth() - 1) / 2;
    if (scale.round()) offset = Math.round(offset);
  }
  return scale(value) + offset;
}

function split([min, max], count = 10) {
  const sep = (max - min) / count;
  const list = [];
  while(min <= max) {
    list.push(min);
    min += sep;
  }
  return list;
}

// adapted from d3-axis to support React svg
export default class Axis extends Component {
  render() {
    const
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = this.props.orient === 'top' || this.props.orient === 'left' ? -1 : 1,
      x = this.props.orient === 'left' || this.props.orient === 'right' ? 'x' : 'y',
      y = this.props.orient === 'top' || this.props.orient === 'bottom' ? 'x' : 'y',
      values = this.props.ticks === 0 ? null : split(this.props.scale.domain(), this.props.ticks),
      spacing = Math.max(tickSizeInner, 0) + tickPadding,
      range = this.props.scale.range(),
      range0 = range[0] + 0.5,
      range1 = range[range.length - 1] + 0.5;
    const pathProps = {
      fill: 'none',
      stroke: '#000',
      d: this.props.orient === 'left' || this.props.orient === 'right'
        ? 'M' + k * tickSizeOuter + ',' + range0 + 'H0.5V' + range1 + 'H' + k * tickSizeOuter
        : 'M' + range0 + ',' + k * tickSizeOuter + 'V0.5H' + range1 + 'V' + k * tickSizeOuter
    };
    return (
      <G>
        <Path {...pathProps}/>
        { values && values.map((value, i) => {
          const gProps = {
            key: `${i}`,
            [y]: center(this.props.scale, value),
          };
          const lineProps = {
            stroke: '#000',
            [`${x}2`]: k * tickSizeInner,
          };
          const textProps = {
            fill: '#000',
            [x]: k * spacing,
            [`d${y}`]: k * 15,
            textAnchor: this.props.orient === 'right' ? 'start' : this.props.orient === 'left' ? 'end' : 'middle',
            fontSize: 10,
          }

          return (
            <G {...gProps}>
              <Line {...lineProps}/>
              <Text {...textProps}>{value}</Text>
            </G>
          );
        })}
      </G>
    )
  }
}
