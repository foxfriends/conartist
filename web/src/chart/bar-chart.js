'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const colors_1 = require("material-ui/styles/colors");
const d3 = require("d3");
const react_utils_1 = require("../react-utils");
class BarChart extends React.Component {
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
            .attr('x', d => x(d))
            .attr('y', d => y(this.props.bars[d]))
            .attr('fill', d => {
            if (typeof this.props.colors === 'function') {
                return this.props.colors(this.props.bars[d]);
            }
            else if (typeof this.props.colors === 'object') {
                return this.props.colors[d];
            }
            else {
                return colors_1.cyan400;
            }
        })
            .attr('width', x.bandwidth())
            .attr('height', d => this.height - y(this.props.bars[d]));
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
    }
    render() {
        return (React.createElement("div", { style: { width: '100%' }, ref: div => this.setWidth(div) },
            React.createElement("svg", { ref: svg => this.renderChart(svg) })));
    }
}
exports.default = react_utils_1.Resizable(BarChart);
