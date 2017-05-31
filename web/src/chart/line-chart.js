'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const colors_1 = require("material-ui/styles/colors");
const d3 = require("d3");
const react_utils_1 = require("../react-utils");
class LineChart extends React.Component {
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
        const g = svg
            .attr('width', this.outerWidth)
            .attr('height', this.outerHeight)
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
        g.append('g')
            .attr('transform', `translate(0,${this.height})`)
            .call(d3.axisBottom(x).ticks(9))
            .select('.domain')
            .remove();
        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .attr('text-anchor', 'end')
            .text(this.props.yLabel);
        g.append('path')
            .datum(this.props.buckets)
            .attr('fill', 'none')
            .attr('stroke', colors_1.cyan400)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1.5)
            .attr('d', line);
    }
    render() {
        return (React.createElement("div", { style: { width: '100%' }, ref: div => this.setWidth(div) },
            React.createElement("svg", { ref: svg => this.renderChart(svg) })));
    }
}
exports.default = react_utils_1.Resizable(LineChart);
