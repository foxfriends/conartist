'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const sales_per_design_1 = require("./sales-per-design");
const sales_per_type_1 = require("./sales-per-type");
const sales_over_time_1 = require("./sales-over-time");
const inventory_1 = require("./inventory");
class Stats extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(sales_per_design_1.default, { products: this.props.products, records: this.props.records }),
            React.createElement(sales_per_type_1.default, { products: this.props.products, records: this.props.records }),
            React.createElement(sales_over_time_1.default, { records: this.props.records }),
            React.createElement(inventory_1.default, { products: this.props.store.products, records: this.props.records })));
    }
}
exports.default = Stats;
