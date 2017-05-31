'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const d3 = require("d3");
const react_utils_1 = require("../react-utils");
class StackedBarChart extends React.Component {
    constructor() {
        super(...arguments);
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    }
    get outerWidth() { return this.bounds ? this.bounds.width : 150; }
    get width() { return this.outerWidth - this.margin.left - this.margin.right; }
    get outerHeight() { return Math.min(this.outerWidth, 700); }
    get height() { return this.outerHeight - this.margin.top - this.margin.bottom; }
    setWidth(div) {
        if (div) {
            this.bounds = div.getBoundingClientRect();
            this.renderChart();
        }
    }
    renderChart(el) {
        if (el) {
            this.svg = el;
        }
        else if (this.svg) {
            el = this.svg;
        }
        else {
            return;
        }
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
        const z = d3.scaleOrdinal()
            .domain(Object.keys(this.props.legend))
            .range(Object.keys(this.props.legend).map(_ => this.props.legend[_].color));
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
        const stack = d3.stack()
            .keys(Object.keys(this.props.legend));
        const data = Object.keys(this.props.bars).map(name => (Object.assign({ name }, this.props.bars[name])));
        g.append('g')
            .selectAll('g')
            .data(stack(data))
            .enter().append('g')
            .attr('fill', d => z(d.key))
            .selectAll('rect')
            .data((d) => d)
            .enter().append('rect')
            .attr('x', (d) => x(d.data.name))
            .attr('y', (d) => y(d[1]))
            .attr('height', (d) => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth());
        g.append('g')
            .selectAll('.label')
            .data(Object.keys(this.props.bars))
            .enter().append('text')
            .attr('class', 'label')
            .text(d => d)
            .attr('y', d => x(d) + x.bandwidth() / 2)
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
        return (React.createElement("div", { style: { width: '100%' }, ref: div => this.setWidth(div) },
            React.createElement("svg", { ref: svg => this.renderChart(svg) })));
    }
}
exports.default = react_utils_1.Resizable(StackedBarChart);
