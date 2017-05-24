'use strict';
import * as React from 'react';
import * as d3 from 'd3';

type Props = {
  bars: { [key: string]: { [key: string]: number } };
  legend: { [key: string]: { color: string, name: string } };
  yLabel: string;
};
type State = {};

export default class StackedBarChart extends React.Component<Props, State> {
  private readonly margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private get outerWidth() { return window.innerWidth; }
  private get width() { return this.outerWidth - this.margin.left - this.margin.right; }
  private get outerHeight() { return Math.min(window.innerWidth, 700); }
  private get height() { return this.outerHeight - this.margin.top - this.margin.bottom; }
  private tooltips: HTMLDivElement;

  private renderChart(el: SVGSVGElement): void {
    if(!el) { return; }
    el.innerHTML = '';
    const svg = d3.select(el);
    const max = Math.max(...Object.keys(this.props.bars).map(key => Object.keys(this.props.bars[key]).reduce((a, k) => a + this.props.bars[key][k], 0)));
    const x = d3.scaleBand()
      .domain(Object.keys(this.props.bars))
      .rangeRound([0, this.width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, max])
      .rangeRound([this.height, 0]);
    const z = d3.scaleOrdinal<string>()
      .domain(Object.keys(this.props.legend))
      .range(Object.keys(this.props.legend).map(_ => this.props.legend[_].color));
    const g = svg.append('g')
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

    const stack = d3.stack()
      .keys(Object.keys(this.props.legend));

    // HACK: this is some nasty type-sorcery
    const data = Object.keys(this.props.bars).map(name => ({ name, ...this.props.bars[name] } as any)) as { [key: string]: number }[];

    g.append('g')
      .selectAll('g')
      .data(stack(data))
      .enter().append('g')
        .attr('fill', d => z(d.key))
        .selectAll('rect')
        // HACK: more nasty type-sorcery
        .data((d: d3.Series<{ [key: string]: number }, string>) => d as {}[])
        .enter().append('rect')
          // HACK: that's only kind of the type
          .attr('x', (d: d3.SeriesPoint<{ name: string }>) => x(d.data.name)!)
          .attr('y', (d: d3.SeriesPoint<{ [key: string]: number }>) => y(d[1]))
          .attr('height', (d: d3.SeriesPoint<{ [key: string]: number }>) => y(d[0]) - y(d[1]))
          .attr('width', x.bandwidth());

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
    const legend = g.append('g')
      .attr('font-family', '"Roboto",sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(Object.keys(this.props.legend).reverse())
      .enter().append('g')
        .attr('transform', (_, i) => `translate(0,${i * 20})`);

    legend.append('rect')
      .attr('x', this.width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', z);

    legend.append('text')
      .attr('x', this.width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => this.props.legend[d].name);
  }

  render() {
    return (
      <div>
        <svg width={this.outerWidth} height={this.outerHeight} ref={svg => this.renderChart(svg)}></svg>
        <div ref={div => this.tooltips = div}></div>
      </div>
    );
  }
};
