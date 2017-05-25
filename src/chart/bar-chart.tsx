'use strict';
import * as React from 'react';
import { cyan400 as barColor } from 'material-ui/styles/colors';
import * as d3 from 'd3';

import { Resizable } from '../react-utils';

type Props = {
  bars: { [key: string]: number };
  colors?: { [key: string]: string };
  yLabel: string;
};
type State = {};

class BarChart extends React.Component<Props, State> {
  private bounds: ClientRect;
  private svg: SVGSVGElement;
  private readonly margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private get outerWidth() { return this.bounds ? this.bounds.width : 150; }
  private get width() { return this.outerWidth - this.margin.left - this.margin.right; }
  private get outerHeight() { return Math.min(this.outerWidth, 700); }
  private get height() { return this.outerHeight - this.margin.top - this.margin.bottom; }

  private setWidth(div: HTMLDivElement): void {
    if(div) {
      this.bounds = div.getBoundingClientRect();
      this.renderChart();
    }
  }

  private renderChart(el?: SVGSVGElement): void {
    if(el) {
      this.svg = el;
    } else if(this.svg) {
      el = this.svg;
    } else {
      return;
    }
    el.innerHTML = '';
    const svg = d3.select(el);
    const max = Math.max(...Object.keys(this.props.bars).map(_ => this.props.bars[_]));
    const x = d3.scaleBand()
      .domain(Object.keys(this.props.bars))
      .rangeRound([0, this.width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, max])
      .rangeRound([this.height, 0]);

    const g = svg
      .attr('width', this.outerWidth)
      .attr('height', this.outerHeight)
      .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(0))
      .selectAll('text').remove();

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(Math.min(max, 10)))
      .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text(this.props.yLabel);

    g.append('g')
      .selectAll('.bar')
      .data(Object.keys(this.props.bars))
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d)!)
        .attr('y', d => y(this.props.bars[d]))
        .attr('fill', d => (this.props.colors && this.props.colors[d]) || barColor)
        .attr('width', x.bandwidth())
        .attr('height', d => this.height - y(this.props.bars[d]));

    g.append('g')
      .selectAll('.label')
      .data(Object.keys(this.props.bars))
      .enter().append('text')
        .attr('class', 'label')
        .text(d => d)
        .attr('y', d => x(d)! + x.bandwidth() / 2)
        .attr('x', 5 - this.height)
        .attr('dy', '.35em')
        .attr('transform', 'rotate(-90)')
        .attr('fill', '#333')
        .style('text-anchor', 'start')
        .style('vertical-align', 'middle')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', `${Math.min(14, x.bandwidth())}px`);
  }

  render() {
    return (
      <div style={{ width: '100%' }} ref={div => this.setWidth(div)}>
        <svg ref={svg => this.renderChart(svg)}></svg>
      </div>
    );
  }
}

export default Resizable(BarChart);
